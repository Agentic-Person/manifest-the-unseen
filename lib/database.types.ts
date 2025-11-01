/**
 * Supabase Database Type Definitions
 *
 * Auto-generated type definitions for the Manifest the Unseen database schema.
 * These types provide full TypeScript support for database operations.
 *
 * Generated from: supabase/migrations/20251031_initial_schema.sql
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          whop_user_id: string
          email: string | null
          display_name: string | null
          current_phase: number
          signal_strength_score: number
          level: 'Seeker' | 'Practitioner' | 'Advanced' | 'Master'
          journal_streak: number
          badges: Json
          created_at: string
          last_active: string
          updated_at: string
        }
        Insert: {
          id?: string
          whop_user_id: string
          email?: string | null
          display_name?: string | null
          current_phase?: number
          signal_strength_score?: number
          level?: 'Seeker' | 'Practitioner' | 'Advanced' | 'Master'
          journal_streak?: number
          badges?: Json
          created_at?: string
          last_active?: string
          updated_at?: string
        }
        Update: {
          id?: string
          whop_user_id?: string
          email?: string | null
          display_name?: string | null
          current_phase?: number
          signal_strength_score?: number
          level?: 'Seeker' | 'Practitioner' | 'Advanced' | 'Master'
          journal_streak?: number
          badges?: Json
          created_at?: string
          last_active?: string
          updated_at?: string
        }
        Relationships: []
      }
      workbook_progress: {
        Row: {
          id: string
          user_id: string
          phase: number
          exercise_key: string
          data: Json
          completed: boolean
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          phase: number
          exercise_key: string
          data?: Json
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          phase?: number
          exercise_key?: string
          data?: Json
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'workbook_progress_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'user_profiles'
            referencedColumns: ['id']
          }
        ]
      }
      journal_entries: {
        Row: {
          id: string
          user_id: string
          type: 'gratitude' | 'vision' | 'frequency' | 'breakthrough'
          content: string
          ai_analysis: Json | null
          linked_phase: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'gratitude' | 'vision' | 'frequency' | 'breakthrough'
          content: string
          ai_analysis?: Json | null
          linked_phase?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'gratitude' | 'vision' | 'frequency' | 'breakthrough'
          content?: string
          ai_analysis?: Json | null
          linked_phase?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'journal_entries_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'user_profiles'
            referencedColumns: ['id']
          }
        ]
      }
      ai_conversations: {
        Row: {
          id: string
          user_id: string
          messages: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          messages?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          messages?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'ai_conversations_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'user_profiles'
            referencedColumns: ['id']
          }
        ]
      }
      subscription_status: {
        Row: {
          id: string
          user_id: string
          whop_membership_id: string
          plan_name: string | null
          status: 'active' | 'cancelled' | 'expired' | 'trialing'
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          whop_membership_id: string
          plan_name?: string | null
          status: 'active' | 'cancelled' | 'expired' | 'trialing'
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          whop_membership_id?: string
          plan_name?: string | null
          status?: 'active' | 'cancelled' | 'expired' | 'trialing'
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'subscription_status_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'user_profiles'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Type helpers for easier usage
export type UserProfile = Database['public']['Tables']['user_profiles']['Row']
export type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert']
export type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update']

export type WorkbookProgress = Database['public']['Tables']['workbook_progress']['Row']
export type WorkbookProgressInsert = Database['public']['Tables']['workbook_progress']['Insert']
export type WorkbookProgressUpdate = Database['public']['Tables']['workbook_progress']['Update']

export type JournalEntry = Database['public']['Tables']['journal_entries']['Row']
export type JournalEntryInsert = Database['public']['Tables']['journal_entries']['Insert']
export type JournalEntryUpdate = Database['public']['Tables']['journal_entries']['Update']

export type AIConversation = Database['public']['Tables']['ai_conversations']['Row']
export type AIConversationInsert = Database['public']['Tables']['ai_conversations']['Insert']
export type AIConversationUpdate = Database['public']['Tables']['ai_conversations']['Update']

export type SubscriptionStatus = Database['public']['Tables']['subscription_status']['Row']
export type SubscriptionStatusInsert = Database['public']['Tables']['subscription_status']['Insert']
export type SubscriptionStatusUpdate = Database['public']['Tables']['subscription_status']['Update']

// Enum types
export type UserLevel = 'Seeker' | 'Practitioner' | 'Advanced' | 'Master'
export type JournalType = 'gratitude' | 'vision' | 'frequency' | 'breakthrough'
export type SubscriptionStatusType = 'active' | 'cancelled' | 'expired' | 'trialing'

// Badge type (from JSONB badges field)
export interface Badge {
  id: string
  name: string
  description: string
  earnedAt: string
  icon?: string
}

// AI Analysis type (from JSONB ai_analysis field)
export interface AIAnalysis {
  insights?: string[]
  patterns?: string[]
  frequency?: string
  recommendations?: string[]
  sentiment?: 'positive' | 'neutral' | 'negative'
  timestamp: string
}

// Message type (for ai_conversations.messages)
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
}

// Workbook exercise data types
export interface WorkbookExerciseData {
  [key: string]: any // Flexible structure for different exercise types
}
