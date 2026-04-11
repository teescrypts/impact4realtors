export type StepType = "email" | "call" | "meeting" | "sms";

export type TimingType = "immediate" | "delay";

export type TagActionType = "assign" | "change";

export interface TagAction {
  type: TagActionType;
  tagName: string;
  newTagName?: string; // Only used when type is 'change'
}

export interface EntryAction {
  tagAction: TagAction;
}

export interface StepTiming {
  type: TimingType;
  delayValue?: number;
  delayUnit?: "minutes" | "hours" | "days";
}

export type TriggerType = "timing" | "action";

export interface StepTrigger {
  type: TriggerType;
  timing?: StepTiming;
  tagAction?: TagAction;
}

export interface JourneyStep {
  id: string;
  type: StepType;
  title: string;
  description?: string;
  trigger: StepTrigger;
}

export type ContactType = "buyer" | "seller";

export interface Journey {
  id: string;
  name: string;
  contactType: ContactType;
  entryAction: EntryAction;
  isActive: boolean;
  steps: JourneyStep[];
  createdAt: Date;
  updatedAt: Date;
}

export type TagCategory = 'buyer' | 'seller';

export interface Tag {
  id: string;
  name: string;
  category: TagCategory;
  order: number;
  color: string;
}



