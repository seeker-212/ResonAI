"use client";
import { SettingsPanel } from "../text-to-speech/components/settings-panel";
import { TextInputPanel } from "../text-to-speech/components/text-input-panel";
import { VoicePreviewPlaceholder } from "../text-to-speech/components/voice-preview-placeholder";
import {
  TextToSpeechForm,
  defaultTTSValues,
} from "../text-to-speech/components/text-to-speech-form";

export function TextToSpeechView() {
  return (
    <TextToSpeechForm defaultValues={defaultTTSValues}>
      <div className="flex min-h-0 overflow-hidden">
        <div className="flex min-h-0 flex-1 flex-col">
          <TextInputPanel />
          <VoicePreviewPlaceholder />
        </div>
        <SettingsPanel />
      </div>
    </TextToSpeechForm>
  );
}
