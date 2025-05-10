"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useChat } from '@/lib/chat-context';
import { transcribeAudio } from '@/lib/api';
import { FEATURES } from '@/lib/config';

export default function ChatInput() {
  const { sendMessage, isLoading } = useChat();
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true); // Always enable audio recording by default
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingFeedback, setRecordingFeedback] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Check if audio recording is enabled in the features
  useEffect(() => {
    // Always enable audio recording regardless of FEATURES setting
    setAudioEnabled(true);
  }, []);
  
  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, []);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;
    
    await sendMessage(message);
    setMessage('');
  };
  
  const toggleRecording = async () => {
    if (isProcessingAudio) return; // Don't allow toggling while processing
    
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  
  const startRecording = async () => {
    setRecordingError(null);
    setRecordingFeedback('');
    setRecordingDuration(0);
    try {
      console.log('Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Microphone access granted');
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        console.log('Data available event:', e.data.size);
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      
      mediaRecorderRef.current.onstop = async () => {
        console.log('Recording stopped, processing audio...');
        setRecordingFeedback('Processing audio...');
        setIsProcessingAudio(true);
        
        if (audioChunksRef.current.length === 0) {
          setRecordingError('No audio data captured. Please try again.');
          setIsProcessingAudio(false);
          return;
        }
        
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        console.log('Audio blob created:', audioBlob.size, 'bytes');
        
        await processAudioRecording(audioBlob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
        setIsProcessingAudio(false);
      };
      
      // Start a timer to show recording duration
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingFeedback('Recording... Speak now');
      console.log('Recording started');
    } catch (err) {
      console.error('Error starting recording:', err);
      setRecordingError('Failed to access microphone. Please check permissions.');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      console.log('Stopping recording...');
      
      // Clear the recording timer
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  const processAudioRecording = async (audioBlob: Blob) => {
    try {
      console.log('Sending audio for transcription...');
      const result = await transcribeAudio(audioBlob);
      
      if (result.error) {
        setRecordingError(result.error);
        return;
      }
      
      // Log debug info if available
      if (result.debug_info) {
        console.log('Transcription debug info:', result.debug_info);
      }
      
      // Combine all segments into a single message
      if (result.segments && result.segments.length > 0) {
        const transcribedText = result.segments
          .map(segment => segment.text)
          .join(' ')
          .trim();
        
        console.log('Transcribed text:', transcribedText);
        
        if (transcribedText) {
          setMessage(transcribedText);
          setRecordingFeedback('Transcription successful!');
        } else {
          setRecordingError('No speech detected. Please try again.');
        }
      } else {
        setRecordingError('Transcription failed. Please try again.');
      }
    } catch (err) {
      console.error('Error processing audio:', err);
      setRecordingError('Error processing audio. Please try again.');
    }
  };
  
  return (
    <div className="border-t bg-white p-4">
      {recordingError && (
        <div className="mb-2 text-sm text-red-500">{recordingError}</div>
      )}
      
      {recordingFeedback && !recordingError && (
        <div className="mb-2 text-sm text-blue-500">
          {recordingFeedback}
          {isRecording && recordingDuration > 0 && ` (${recordingDuration}s)`}
        </div>
      )}
      
      <form onSubmit={handleSendMessage} className="flex gap-2">
        {/* Always show the microphone button */}
        <Button
          type="button"
          variant={isRecording ? "destructive" : "outline"}
          size="icon"
          onClick={toggleRecording}
          title={isRecording ? "Stop recording" : "Start recording"}
          disabled={isProcessingAudio}
        >
          {isProcessingAudio ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isRecording ? (
            <MicOff className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </Button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading || isProcessingAudio}
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={!message.trim() || isLoading || isProcessingAudio}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
} 