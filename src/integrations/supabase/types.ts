export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      client_profiles: {
        Row: {
          address: string | null
          created_at: string | null
          email: string
          first_job_date: string | null
          first_name: string | null
          id: string
          last_job_date: string | null
          last_name: string | null
          notes: string | null
          organization: string | null
          phone: string | null
          preferred_contact_method: string | null
          tags: string[] | null
          title: string | null
          total_jobs: number | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email: string
          first_job_date?: string | null
          first_name?: string | null
          id?: string
          last_job_date?: string | null
          last_name?: string | null
          notes?: string | null
          organization?: string | null
          phone?: string | null
          preferred_contact_method?: string | null
          tags?: string[] | null
          title?: string | null
          total_jobs?: number | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string
          first_job_date?: string | null
          first_name?: string | null
          id?: string
          last_job_date?: string | null
          last_name?: string | null
          notes?: string | null
          organization?: string | null
          phone?: string | null
          preferred_contact_method?: string | null
          tags?: string[] | null
          title?: string | null
          total_jobs?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      client_properties: {
        Row: {
          acquired_date: string | null
          client_id: string | null
          client_property_code: string | null
          client_property_name: string | null
          disposed_date: string | null
          id: string
          is_active: boolean | null
          ownership_percentage: number | null
          ownership_type: string | null
          property_id: string | null
        }
        Insert: {
          acquired_date?: string | null
          client_id?: string | null
          client_property_code?: string | null
          client_property_name?: string | null
          disposed_date?: string | null
          id?: string
          is_active?: boolean | null
          ownership_percentage?: number | null
          ownership_type?: string | null
          property_id?: string | null
        }
        Update: {
          acquired_date?: string | null
          client_id?: string | null
          client_property_code?: string | null
          client_property_name?: string | null
          disposed_date?: string | null
          id?: string
          is_active?: boolean | null
          ownership_percentage?: number | null
          ownership_type?: string | null
          property_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_properties_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_portfolio_summary"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "client_properties_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_properties_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "client_portfolio_summary"
            referencedColumns: ["property_id"]
          },
          {
            foreignKeyName: "client_properties_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_properties_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property_job_history"
            referencedColumns: ["property_id"]
          },
        ]
      }
      clients: {
        Row: {
          billing_email: string | null
          client_code: string | null
          client_name: string
          company_type: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          last_appraisal_date: string | null
          payment_terms: string | null
          preferred_appraiser_name: string | null
          primary_contact_email: string | null
          primary_contact_name: string | null
          primary_contact_phone: string | null
          standard_turnaround_days: number | null
          total_appraisals: number | null
          total_portfolio_value: number | null
          total_properties: number | null
          updated_at: string | null
          volume_discount_percentage: number | null
        }
        Insert: {
          billing_email?: string | null
          client_code?: string | null
          client_name: string
          company_type?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_appraisal_date?: string | null
          payment_terms?: string | null
          preferred_appraiser_name?: string | null
          primary_contact_email?: string | null
          primary_contact_name?: string | null
          primary_contact_phone?: string | null
          standard_turnaround_days?: number | null
          total_appraisals?: number | null
          total_portfolio_value?: number | null
          total_properties?: number | null
          updated_at?: string | null
          volume_discount_percentage?: number | null
        }
        Update: {
          billing_email?: string | null
          client_code?: string | null
          client_name?: string
          company_type?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_appraisal_date?: string | null
          payment_terms?: string | null
          preferred_appraiser_name?: string | null
          primary_contact_email?: string | null
          primary_contact_name?: string | null
          primary_contact_phone?: string | null
          standard_turnaround_days?: number | null
          total_appraisals?: number | null
          total_portfolio_value?: number | null
          total_properties?: number | null
          updated_at?: string | null
          volume_discount_percentage?: number | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          company: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          message: string
          phone: string | null
          property_type: string | null
          request_type: string | null
          source: string | null
          status: string | null
          timeline: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          message: string
          phone?: string | null
          property_type?: string | null
          request_type?: string | null
          source?: string | null
          status?: string | null
          timeline?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          message?: string
          phone?: string | null
          property_type?: string | null
          request_type?: string | null
          source?: string | null
          status?: string | null
          timeline?: string | null
        }
        Relationships: []
      }
      conversation_chunks: {
        Row: {
          chunk_index: number
          content: string
          conversation_id: string | null
          created_at: string | null
          embedding: string | null
          id: string
          message_type: string | null
          metadata: Json | null
          token_count: number | null
        }
        Insert: {
          chunk_index: number
          content: string
          conversation_id?: string | null
          created_at?: string | null
          embedding?: string | null
          id?: string
          message_type?: string | null
          metadata?: Json | null
          token_count?: number | null
        }
        Update: {
          chunk_index?: number
          content?: string
          conversation_id?: string | null
          created_at?: string | null
          embedding?: string | null
          id?: string
          message_type?: string | null
          metadata?: Json | null
          token_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_chunks_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string | null
          git_branch: string | null
          git_commit: string | null
          id: string
          project_name: string
          session_id: string
          total_chunks: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          git_branch?: string | null
          git_commit?: string | null
          id?: string
          project_name: string
          session_id: string
          total_chunks?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          git_branch?: string | null
          git_commit?: string | null
          id?: string
          project_name?: string
          session_id?: string
          total_chunks?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      files_modified: {
        Row: {
          change_type: string | null
          conversation_id: string | null
          created_at: string | null
          file_path: string
          id: string
        }
        Insert: {
          change_type?: string | null
          conversation_id?: string | null
          created_at?: string | null
          file_path: string
          id?: string
        }
        Update: {
          change_type?: string | null
          conversation_id?: string | null
          created_at?: string | null
          file_path?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "files_modified_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      job_documents: {
        Row: {
          created_at: string | null
          description: string | null
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string | null
          google_drive_file_id: string | null
          google_drive_url: string | null
          id: string
          is_client_shared: boolean | null
          job_id: string | null
          storage_type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          google_drive_file_id?: string | null
          google_drive_url?: string | null
          id?: string
          is_client_shared?: boolean | null
          job_id?: string | null
          storage_type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          google_drive_file_id?: string | null
          google_drive_url?: string | null
          id?: string
          is_client_shared?: boolean | null
          job_id?: string | null
          storage_type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_documents_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_documents_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "property_job_history"
            referencedColumns: ["job_id"]
          },
        ]
      }
      job_files: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          job_id: string | null
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          job_id?: string | null
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          job_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_files_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_files_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "property_job_history"
            referencedColumns: ["job_id"]
          },
        ]
      }
      job_loe_details: {
        Row: {
          appraisal_fee: number | null
          clickup_task_id: string | null
          clickup_task_url: string | null
          created_at: string
          delivery_date: string | null
          disbursement_percentage: string | null
          id: string
          internal_comments: string | null
          job_id: string | null
          job_number: string | null
          payment_terms: string | null
          property_rights_appraised: string | null
          report_type: string | null
          retainer_amount: string | null
          scope_of_work: string | null
          special_instructions: string | null
          updated_at: string
          valcre_job_id: number | null
          valuation_premises: string | null
        }
        Insert: {
          appraisal_fee?: number | null
          clickup_task_id?: string | null
          clickup_task_url?: string | null
          created_at?: string
          delivery_date?: string | null
          disbursement_percentage?: string | null
          id?: string
          internal_comments?: string | null
          job_id?: string | null
          job_number?: string | null
          payment_terms?: string | null
          property_rights_appraised?: string | null
          report_type?: string | null
          retainer_amount?: string | null
          scope_of_work?: string | null
          special_instructions?: string | null
          updated_at?: string
          valcre_job_id?: number | null
          valuation_premises?: string | null
        }
        Update: {
          appraisal_fee?: number | null
          clickup_task_id?: string | null
          clickup_task_url?: string | null
          created_at?: string
          delivery_date?: string | null
          disbursement_percentage?: string | null
          id?: string
          internal_comments?: string | null
          job_id?: string | null
          job_number?: string | null
          payment_terms?: string | null
          property_rights_appraised?: string | null
          report_type?: string | null
          retainer_amount?: string | null
          scope_of_work?: string | null
          special_instructions?: string | null
          updated_at?: string
          valcre_job_id?: number | null
          valuation_premises?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_loe_details_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_loe_details_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "property_job_history"
            referencedColumns: ["job_id"]
          },
        ]
      }
      job_property_info: {
        Row: {
          assessed_value: number | null
          assessment_year: string | null
          building_size: string | null
          created_at: string
          flood_zone: string | null
          gross_land_acres: number | null
          gross_land_sf: number | null
          id: string
          improved_assessment_value: number | null
          job_id: string | null
          land_assessment_value: number | null
          land_use_designation: string | null
          legal_description: string | null
          number_of_units: number | null
          parcel_number: string | null
          parking_spaces: number | null
          taxes: number | null
          total_assessment_value: number | null
          updated_at: string
          usable_land_acres: number | null
          usable_land_sf: number | null
          utilities: string | null
          year_built: string | null
          zone_abbreviation: string | null
          zoning_classification: string | null
        }
        Insert: {
          assessed_value?: number | null
          assessment_year?: string | null
          building_size?: string | null
          created_at?: string
          flood_zone?: string | null
          gross_land_acres?: number | null
          gross_land_sf?: number | null
          id?: string
          improved_assessment_value?: number | null
          job_id?: string | null
          land_assessment_value?: number | null
          land_use_designation?: string | null
          legal_description?: string | null
          number_of_units?: number | null
          parcel_number?: string | null
          parking_spaces?: number | null
          taxes?: number | null
          total_assessment_value?: number | null
          updated_at?: string
          usable_land_acres?: number | null
          usable_land_sf?: number | null
          utilities?: string | null
          year_built?: string | null
          zone_abbreviation?: string | null
          zoning_classification?: string | null
        }
        Update: {
          assessed_value?: number | null
          assessment_year?: string | null
          building_size?: string | null
          created_at?: string
          flood_zone?: string | null
          gross_land_acres?: number | null
          gross_land_sf?: number | null
          id?: string
          improved_assessment_value?: number | null
          job_id?: string | null
          land_assessment_value?: number | null
          land_use_designation?: string | null
          legal_description?: string | null
          number_of_units?: number | null
          parcel_number?: string | null
          parking_spaces?: number | null
          taxes?: number | null
          total_assessment_value?: number | null
          updated_at?: string
          usable_land_acres?: number | null
          usable_land_sf?: number | null
          utilities?: string | null
          year_built?: string | null
          zone_abbreviation?: string | null
          zoning_classification?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_property_info_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_property_info_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "property_job_history"
            referencedColumns: ["job_id"]
          },
        ]
      }
      job_submissions: {
        Row: {
          aerial_photo_captured_at: string | null
          aerial_photo_source: string | null
          aerial_photo_url: string | null
          assessment_split_building_value: number | null
          assessment_split_data: Json | null
          assessment_split_gathered_at: string | null
          assessment_split_land_value: number | null
          assessment_split_source: string | null
          assessment_split_total_value: number | null
          asset_condition: string | null
          building_permits_uploaded_at: string | null
          building_permits_urls: Json | null
          clickup_task_id: string | null
          clickup_task_url: string | null
          client_address: string | null
          client_email: string
          client_first_name: string
          client_id: string | null
          client_last_name: string
          client_organization: string | null
          client_phone: string
          client_title: string | null
          copied_from_job_id: string | null
          created_at: string
          document_sources: Json | null
          documents_complete_count: number | null
          documents_copied_at: string | null
          documents_total_required: number | null
          docuseal_status: string | null
          docuseal_submission_id: string | null
          flood_map_captured_at: string | null
          flood_map_url: string | null
          flood_zone_status: string | null
          id: string
          intended_use: string | null
          is_portfolio_job: boolean | null
          job_number: string | null
          land_title_status: string | null
          land_title_uploaded_at: string | null
          land_title_url: string | null
          notes: string | null
          permit_years: Json | null
          property_address: string
          property_contact_email: string | null
          property_contact_first_name: string | null
          property_contact_last_name: string | null
          property_contact_phone: string | null
          property_id: string | null
          property_name: string | null
          property_type: string
          recent_improvements: string | null
          same_as_client_contact: boolean | null
          section_4_status: string | null
          site_plan_status: string | null
          site_plan_uploaded_at: string | null
          site_plan_url: string | null
          status: string
          survey_certificate_status: string | null
          survey_certificate_uploaded_at: string | null
          survey_certificate_url: string | null
          tax_notice_status: string | null
          tax_notice_uploaded_at: string | null
          tax_notice_url: string | null
          updated_at: string
          user_id: string | null
          valcre_job_id: string | null
          valuation_premises: string | null
          zoning_designation: string | null
          zoning_map_captured_at: string | null
          zoning_map_source_url: string | null
          zoning_map_url: string | null
        }
        Insert: {
          aerial_photo_captured_at?: string | null
          aerial_photo_source?: string | null
          aerial_photo_url?: string | null
          assessment_split_building_value?: number | null
          assessment_split_data?: Json | null
          assessment_split_gathered_at?: string | null
          assessment_split_land_value?: number | null
          assessment_split_source?: string | null
          assessment_split_total_value?: number | null
          asset_condition?: string | null
          building_permits_uploaded_at?: string | null
          building_permits_urls?: Json | null
          clickup_task_id?: string | null
          clickup_task_url?: string | null
          client_address?: string | null
          client_email: string
          client_first_name: string
          client_id?: string | null
          client_last_name: string
          client_organization?: string | null
          client_phone: string
          client_title?: string | null
          copied_from_job_id?: string | null
          created_at?: string
          document_sources?: Json | null
          documents_complete_count?: number | null
          documents_copied_at?: string | null
          documents_total_required?: number | null
          docuseal_status?: string | null
          docuseal_submission_id?: string | null
          flood_map_captured_at?: string | null
          flood_map_url?: string | null
          flood_zone_status?: string | null
          id?: string
          intended_use?: string | null
          is_portfolio_job?: boolean | null
          job_number?: string | null
          land_title_status?: string | null
          land_title_uploaded_at?: string | null
          land_title_url?: string | null
          notes?: string | null
          permit_years?: Json | null
          property_address: string
          property_contact_email?: string | null
          property_contact_first_name?: string | null
          property_contact_last_name?: string | null
          property_contact_phone?: string | null
          property_id?: string | null
          property_name?: string | null
          property_type: string
          recent_improvements?: string | null
          same_as_client_contact?: boolean | null
          section_4_status?: string | null
          site_plan_status?: string | null
          site_plan_uploaded_at?: string | null
          site_plan_url?: string | null
          status?: string
          survey_certificate_status?: string | null
          survey_certificate_uploaded_at?: string | null
          survey_certificate_url?: string | null
          tax_notice_status?: string | null
          tax_notice_uploaded_at?: string | null
          tax_notice_url?: string | null
          updated_at?: string
          user_id?: string | null
          valcre_job_id?: string | null
          valuation_premises?: string | null
          zoning_designation?: string | null
          zoning_map_captured_at?: string | null
          zoning_map_source_url?: string | null
          zoning_map_url?: string | null
        }
        Update: {
          aerial_photo_captured_at?: string | null
          aerial_photo_source?: string | null
          aerial_photo_url?: string | null
          assessment_split_building_value?: number | null
          assessment_split_data?: Json | null
          assessment_split_gathered_at?: string | null
          assessment_split_land_value?: number | null
          assessment_split_source?: string | null
          assessment_split_total_value?: number | null
          asset_condition?: string | null
          building_permits_uploaded_at?: string | null
          building_permits_urls?: Json | null
          clickup_task_id?: string | null
          clickup_task_url?: string | null
          client_address?: string | null
          client_email?: string
          client_first_name?: string
          client_id?: string | null
          client_last_name?: string
          client_organization?: string | null
          client_phone?: string
          client_title?: string | null
          copied_from_job_id?: string | null
          created_at?: string
          document_sources?: Json | null
          documents_complete_count?: number | null
          documents_copied_at?: string | null
          documents_total_required?: number | null
          docuseal_status?: string | null
          docuseal_submission_id?: string | null
          flood_map_captured_at?: string | null
          flood_map_url?: string | null
          flood_zone_status?: string | null
          id?: string
          intended_use?: string | null
          is_portfolio_job?: boolean | null
          job_number?: string | null
          land_title_status?: string | null
          land_title_uploaded_at?: string | null
          land_title_url?: string | null
          notes?: string | null
          permit_years?: Json | null
          property_address?: string
          property_contact_email?: string | null
          property_contact_first_name?: string | null
          property_contact_last_name?: string | null
          property_contact_phone?: string | null
          property_id?: string | null
          property_name?: string | null
          property_type?: string
          recent_improvements?: string | null
          same_as_client_contact?: boolean | null
          section_4_status?: string | null
          site_plan_status?: string | null
          site_plan_uploaded_at?: string | null
          site_plan_url?: string | null
          status?: string
          survey_certificate_status?: string | null
          survey_certificate_uploaded_at?: string | null
          survey_certificate_url?: string | null
          tax_notice_status?: string | null
          tax_notice_uploaded_at?: string | null
          tax_notice_url?: string | null
          updated_at?: string
          user_id?: string | null
          valcre_job_id?: string | null
          valuation_premises?: string | null
          zoning_designation?: string | null
          zoning_map_captured_at?: string | null
          zoning_map_source_url?: string | null
          zoning_map_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_submissions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_portfolio_summary"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "job_submissions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_submissions_copied_from_job_id_fkey"
            columns: ["copied_from_job_id"]
            isOneToOne: false
            referencedRelation: "job_submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_submissions_copied_from_job_id_fkey"
            columns: ["copied_from_job_id"]
            isOneToOne: false
            referencedRelation: "property_job_history"
            referencedColumns: ["job_id"]
          },
          {
            foreignKeyName: "job_submissions_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "client_portfolio_summary"
            referencedColumns: ["property_id"]
          },
          {
            foreignKeyName: "job_submissions_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_submissions_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property_job_history"
            referencedColumns: ["property_id"]
          },
        ]
      }
      portfolio_properties: {
        Row: {
          added_date: string | null
          portfolio_id: string
          property_id: string
        }
        Insert: {
          added_date?: string | null
          portfolio_id: string
          property_id: string
        }
        Update: {
          added_date?: string | null
          portfolio_id?: string
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_properties_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portfolio_properties_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "client_portfolio_summary"
            referencedColumns: ["property_id"]
          },
          {
            foreignKeyName: "portfolio_properties_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portfolio_properties_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property_job_history"
            referencedColumns: ["property_id"]
          },
        ]
      }
      portfolios: {
        Row: {
          client_id: string | null
          created_at: string | null
          id: string
          last_valuation_date: string | null
          portfolio_name: string | null
          portfolio_type: string | null
          property_count: number | null
          total_value: number | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          last_valuation_date?: string | null
          portfolio_name?: string | null
          portfolio_type?: string | null
          property_count?: number | null
          total_value?: number | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          last_valuation_date?: string | null
          portfolio_name?: string | null
          portfolio_type?: string | null
          property_count?: number | null
          total_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolios_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_portfolio_summary"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "portfolios_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          address_city: string
          address_postal: string | null
          address_province: string
          address_street: string
          created_at: string | null
          first_appraisal_date: string | null
          full_address: string | null
          id: string
          last_appraisal_date: string | null
          latest_building_size: number | null
          latest_property_type: string | null
          latest_year_built: number | null
          latest_zoning: string | null
          legal_description: string | null
          linc_number: string | null
          roll_number: string | null
          total_appraisals: number | null
          updated_at: string | null
        }
        Insert: {
          address_city: string
          address_postal?: string | null
          address_province: string
          address_street: string
          created_at?: string | null
          first_appraisal_date?: string | null
          full_address?: string | null
          id?: string
          last_appraisal_date?: string | null
          latest_building_size?: number | null
          latest_property_type?: string | null
          latest_year_built?: number | null
          latest_zoning?: string | null
          legal_description?: string | null
          linc_number?: string | null
          roll_number?: string | null
          total_appraisals?: number | null
          updated_at?: string | null
        }
        Update: {
          address_city?: string
          address_postal?: string | null
          address_province?: string
          address_street?: string
          created_at?: string | null
          first_appraisal_date?: string | null
          full_address?: string | null
          id?: string
          last_appraisal_date?: string | null
          latest_building_size?: number | null
          latest_property_type?: string | null
          latest_year_built?: number | null
          latest_zoning?: string | null
          legal_description?: string | null
          linc_number?: string | null
          roll_number?: string | null
          total_appraisals?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      property_documents: {
        Row: {
          document_date: string | null
          document_type: string
          expires_at: string | null
          file_name: string | null
          file_size: number | null
          file_url: string
          id: string
          is_current: boolean | null
          mime_type: string | null
          property_id: string | null
          source_type: string | null
          source_url: string | null
          uploaded_at: string | null
          uploaded_by: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          document_date?: string | null
          document_type: string
          expires_at?: string | null
          file_name?: string | null
          file_size?: number | null
          file_url: string
          id?: string
          is_current?: boolean | null
          mime_type?: string | null
          property_id?: string | null
          source_type?: string | null
          source_url?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          document_date?: string | null
          document_type?: string
          expires_at?: string | null
          file_name?: string | null
          file_size?: number | null
          file_url?: string
          id?: string
          is_current?: boolean | null
          mime_type?: string | null
          property_id?: string | null
          source_type?: string | null
          source_url?: string | null
          uploaded_at?: string | null
          uploaded_by?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_documents_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "client_portfolio_summary"
            referencedColumns: ["property_id"]
          },
          {
            foreignKeyName: "property_documents_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_documents_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property_job_history"
            referencedColumns: ["property_id"]
          },
        ]
      }
    }
    Views: {
      client_portfolio_by_city: {
        Row: {
          address_city: string | null
          avg_property_value: number | null
          client_name: string | null
          most_recent_appraisal: string | null
          property_count: number | null
          total_city_value: number | null
        }
        Relationships: []
      }
      client_portfolio_summary: {
        Row: {
          address_city: string | null
          appreciation_percentage: number | null
          client_code: string | null
          client_id: string | null
          client_name: string | null
          first_appraisal: string | null
          full_address: string | null
          highest_value: number | null
          latest_appraisal_date: string | null
          latest_building_size: number | null
          latest_job_number: string | null
          latest_value: number | null
          latest_zoning: string | null
          property_id: string | null
          total_appraisals: number | null
        }
        Relationships: []
      }
      property_job_history: {
        Row: {
          assessed_value: number | null
          client_name: string | null
          full_address: string | null
          job_date: string | null
          job_id: string | null
          job_number: string | null
          property_id: string | null
          status: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      get_client_properties: {
        Args: { p_client_name: string }
        Returns: {
          city: string
          full_address: string
          last_appraisal: string
          latest_value: number
          property_id: string
          total_appraisals: number
        }[]
      }
      get_database_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          avg_chunks_per_conversation: number
          newest_conversation: string
          oldest_conversation: string
          total_chunks: number
          total_conversations: number
          total_files_modified: number
          total_projects: number
        }[]
      }
      get_recent_sessions: {
        Args: { project_name_param: string; session_count?: number }
        Returns: {
          conversation_id: string
          created_at: string
          git_branch: string
          git_commit: string
          project_name: string
          session_id: string
          total_chunks: number
          updated_at: string
        }[]
      }
      get_session_context: {
        Args: { project_name_param: string; session_id_param: string }
        Returns: {
          chunk_id: string
          chunk_index: number
          content: string
          created_at: string
          message_type: string
          metadata: Json
        }[]
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      match_chunks_by_timeframe: {
        Args: {
          end_time: string
          match_count?: number
          match_threshold?: number
          query_embedding: string
          start_time: string
        }
        Returns: {
          chunk_id: string
          content: string
          created_at: string
          git_branch: string
          git_commit: string
          message_type: string
          metadata: Json
          project_name: string
          session_id: string
          similarity: number
        }[]
      }
      match_session_chunks: {
        Args: {
          filter_metadata?: Json
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          chunk_id: string
          content: string
          created_at: string
          git_branch: string
          git_commit: string
          message_type: string
          metadata: Json
          project_name: string
          session_id: string
          similarity: number
        }[]
      }
      search_conversations: {
        Args: {
          max_results?: number
          project_filter?: string
          search_embedding: string
          search_query: string
          similarity_threshold?: number
        }
        Returns: {
          chunk_index: number
          content: string
          conversation_id: string
          created_at: string
          message_type: string
          metadata: Json
          project_name: string
          session_id: string
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      upsert_property: {
        Args: {
          p_city: string
          p_postal?: string
          p_province: string
          p_street: string
        }
        Returns: string
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
