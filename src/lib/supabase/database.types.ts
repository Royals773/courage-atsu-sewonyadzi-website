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
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      basket_items: {
        Row: {
          basket_id: string
          book_format_id: string
          created_at: string
          id: string
          quantity: number
          unit_price_amount: number
          updated_at: string
        }
        Insert: {
          basket_id: string
          book_format_id: string
          created_at?: string
          id?: string
          quantity?: number
          unit_price_amount: number
          updated_at?: string
        }
        Update: {
          basket_id?: string
          book_format_id?: string
          created_at?: string
          id?: string
          quantity?: number
          unit_price_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "basket_items_basket_id_fkey"
            columns: ["basket_id"]
            isOneToOne: false
            referencedRelation: "baskets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "basket_items_book_format_id_fkey"
            columns: ["book_format_id"]
            isOneToOne: false
            referencedRelation: "book_formats"
            referencedColumns: ["id"]
          },
        ]
      }
      baskets: {
        Row: {
          created_at: string
          id: string
          session_token: string | null
          status: Database["public"]["Enums"]["basket_status"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          session_token?: string | null
          status?: Database["public"]["Enums"]["basket_status"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          session_token?: string | null
          status?: Database["public"]["Enums"]["basket_status"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_post_tags: {
        Row: {
          post_id: string
          tag_id: string
        }
        Insert: {
          post_id: string
          tag_id: string
        }
        Update: {
          post_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "blog_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          category_id: string | null
          content: string
          created_at: string
          deleted_at: string | null
          excerpt: string | null
          featured_image_path: string | null
          id: string
          published_at: string | null
          scheduled_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: Database["public"]["Enums"]["blog_post_status"]
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          category_id?: string | null
          content?: string
          created_at?: string
          deleted_at?: string | null
          excerpt?: string | null
          featured_image_path?: string | null
          id?: string
          published_at?: string | null
          scheduled_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: Database["public"]["Enums"]["blog_post_status"]
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          category_id?: string | null
          content?: string
          created_at?: string
          deleted_at?: string | null
          excerpt?: string | null
          featured_image_path?: string | null
          id?: string
          published_at?: string | null
          scheduled_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["blog_post_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_tags: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      book_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      book_category_books: {
        Row: {
          book_id: string
          category_id: string
          created_at: string
        }
        Insert: {
          book_id: string
          category_id: string
          created_at?: string
        }
        Update: {
          book_id?: string
          category_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_category_books_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "book_category_books_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "book_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      book_formats: {
        Row: {
          book_id: string
          created_at: string
          currency: string
          digital_file_storage_path: string | null
          format_type: Database["public"]["Enums"]["book_format_type"]
          id: string
          is_active: boolean
          is_digital: boolean
          label: string
          price_amount: number
          sku: string | null
          updated_at: string
        }
        Insert: {
          book_id: string
          created_at?: string
          currency?: string
          digital_file_storage_path?: string | null
          format_type: Database["public"]["Enums"]["book_format_type"]
          id?: string
          is_active?: boolean
          is_digital?: boolean
          label: string
          price_amount: number
          sku?: string | null
          updated_at?: string
        }
        Update: {
          book_id?: string
          created_at?: string
          currency?: string
          digital_file_storage_path?: string | null
          format_type?: Database["public"]["Enums"]["book_format_type"]
          id?: string
          is_active?: boolean
          is_digital?: boolean
          label?: string
          price_amount?: number
          sku?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_formats_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      book_images: {
        Row: {
          alt_text: string | null
          book_id: string
          created_at: string
          id: string
          is_cover: boolean
          position: number
          storage_path: string
        }
        Insert: {
          alt_text?: string | null
          book_id: string
          created_at?: string
          id?: string
          is_cover?: boolean
          position?: number
          storage_path: string
        }
        Update: {
          alt_text?: string | null
          book_id?: string
          created_at?: string
          id?: string
          is_cover?: boolean
          position?: number
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "book_images_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      books: {
        Row: {
          author_note: string | null
          created_at: string
          deleted_at: string | null
          description: string | null
          featured: boolean
          has_sample_chapter: boolean
          id: string
          is_new: boolean
          key_lessons: string[]
          popularity_score: number
          practical_outcomes: string[]
          publication_date: string | null
          sample_chapter_storage_path: string | null
          slug: string
          status: Database["public"]["Enums"]["book_status"]
          subtitle: string | null
          table_of_contents: Json
          title: string
          updated_at: string
          who_its_for: string[]
          why_it_matters: string | null
        }
        Insert: {
          author_note?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          featured?: boolean
          has_sample_chapter?: boolean
          id?: string
          is_new?: boolean
          key_lessons?: string[]
          popularity_score?: number
          practical_outcomes?: string[]
          publication_date?: string | null
          sample_chapter_storage_path?: string | null
          slug: string
          status?: Database["public"]["Enums"]["book_status"]
          subtitle?: string | null
          table_of_contents?: Json
          title: string
          updated_at?: string
          who_its_for?: string[]
          why_it_matters?: string | null
        }
        Update: {
          author_note?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          featured?: boolean
          has_sample_chapter?: boolean
          id?: string
          is_new?: boolean
          key_lessons?: string[]
          popularity_score?: number
          practical_outcomes?: string[]
          publication_date?: string | null
          sample_chapter_storage_path?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["book_status"]
          subtitle?: string | null
          table_of_contents?: Json
          title?: string
          updated_at?: string
          who_its_for?: string[]
          why_it_matters?: string | null
        }
        Relationships: []
      }
      client_logos: {
        Row: {
          created_at: string
          id: string
          is_published: boolean
          logo_path: string
          name: string
          position: number
          updated_at: string
          website_url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_published?: boolean
          logo_path: string
          name: string
          position?: number
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_published?: boolean
          logo_path?: string
          name?: string
          position?: number
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          subject?: string | null
        }
        Relationships: []
      }
      digital_downloads: {
        Row: {
          book_format_id: string
          created_at: string
          download_count: number
          download_token: string
          expires_at: string
          id: string
          last_downloaded_at: string | null
          max_downloads: number
          order_item_id: string
          storage_path: string
          updated_at: string
        }
        Insert: {
          book_format_id: string
          created_at?: string
          download_count?: number
          download_token?: string
          expires_at?: string
          id?: string
          last_downloaded_at?: string | null
          max_downloads?: number
          order_item_id: string
          storage_path: string
          updated_at?: string
        }
        Update: {
          book_format_id?: string
          created_at?: string
          download_count?: number
          download_token?: string
          expires_at?: string
          id?: string
          last_downloaded_at?: string | null
          max_downloads?: number
          order_item_id?: string
          storage_path?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "digital_downloads_book_format_id_fkey"
            columns: ["book_format_id"]
            isOneToOne: false
            referencedRelation: "book_formats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "digital_downloads_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
        ]
      }
      discount_codes: {
        Row: {
          code: string
          created_at: string
          currency: string
          description: string | null
          discount_type: Database["public"]["Enums"]["discount_type"]
          discount_value: number
          expires_at: string | null
          id: string
          is_active: boolean
          max_redemptions: number | null
          starts_at: string | null
          times_redeemed: number
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          currency?: string
          description?: string | null
          discount_type: Database["public"]["Enums"]["discount_type"]
          discount_value: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_redemptions?: number | null
          starts_at?: string | null
          times_redeemed?: number
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          currency?: string
          description?: string | null
          discount_type?: Database["public"]["Enums"]["discount_type"]
          discount_value?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_redemptions?: number | null
          starts_at?: string | null
          times_redeemed?: number
          updated_at?: string
        }
        Relationships: []
      }
      faq_items: {
        Row: {
          answer: string
          category: Database["public"]["Enums"]["faq_category"]
          created_at: string
          id: string
          position: number
          question: string
          updated_at: string
        }
        Insert: {
          answer: string
          category: Database["public"]["Enums"]["faq_category"]
          created_at?: string
          id?: string
          position?: number
          question: string
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: Database["public"]["Enums"]["faq_category"]
          created_at?: string
          id?: string
          position?: number
          question?: string
          updated_at?: string
        }
        Relationships: []
      }
      inventory: {
        Row: {
          book_format_id: string
          created_at: string
          id: string
          quantity_on_hand: number | null
          quantity_reserved: number
          reorder_threshold: number
          stock_status: Database["public"]["Enums"]["stock_status"]
          tracks_stock: boolean
          updated_at: string
        }
        Insert: {
          book_format_id: string
          created_at?: string
          id?: string
          quantity_on_hand?: number | null
          quantity_reserved?: number
          reorder_threshold?: number
          stock_status?: Database["public"]["Enums"]["stock_status"]
          tracks_stock?: boolean
          updated_at?: string
        }
        Update: {
          book_format_id?: string
          created_at?: string
          id?: string
          quantity_on_hand?: number | null
          quantity_reserved?: number
          reorder_threshold?: number
          stock_status?: Database["public"]["Enums"]["stock_status"]
          tracks_stock?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_book_format_id_fkey"
            columns: ["book_format_id"]
            isOneToOne: true
            referencedRelation: "book_formats"
            referencedColumns: ["id"]
          },
        ]
      }
      media_folders: {
        Row: {
          created_at: string
          id: string
          name: string
          parent_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          parent_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "media_folders_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "media_folders"
            referencedColumns: ["id"]
          },
        ]
      }
      media_items: {
        Row: {
          alt_text: string | null
          created_at: string
          file_name: string
          file_type: Database["public"]["Enums"]["media_file_type"]
          folder_id: string | null
          id: string
          kit_category: string | null
          mime_type: string
          size_bytes: number
          storage_path: string
          uploaded_by: string | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          file_name: string
          file_type?: Database["public"]["Enums"]["media_file_type"]
          folder_id?: string | null
          id?: string
          kit_category?: string | null
          mime_type: string
          size_bytes?: number
          storage_path: string
          uploaded_by?: string | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          file_name?: string
          file_type?: Database["public"]["Enums"]["media_file_type"]
          folder_id?: string | null
          id?: string
          kit_category?: string | null
          mime_type?: string
          size_bytes?: number
          storage_path?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "media_items_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "media_folders"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          consent: boolean
          email: string
          first_name: string | null
          id: string
          source: string | null
          subscribed_at: string
          tags: string[]
          unsubscribed_at: string | null
        }
        Insert: {
          consent?: boolean
          email: string
          first_name?: string | null
          id?: string
          source?: string | null
          subscribed_at?: string
          tags?: string[]
          unsubscribed_at?: string | null
        }
        Update: {
          consent?: boolean
          email?: string
          first_name?: string | null
          id?: string
          source?: string | null
          subscribed_at?: string
          tags?: string[]
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          book_format_id: string | null
          book_title: string
          created_at: string
          format_label: string
          id: string
          is_digital: boolean
          line_total_amount: number
          order_id: string
          quantity: number
          unit_price_amount: number
        }
        Insert: {
          book_format_id?: string | null
          book_title: string
          created_at?: string
          format_label: string
          id?: string
          is_digital?: boolean
          line_total_amount: number
          order_id: string
          quantity: number
          unit_price_amount: number
        }
        Update: {
          book_format_id?: string | null
          book_title?: string
          created_at?: string
          format_label?: string
          id?: string
          is_digital?: boolean
          line_total_amount?: number
          order_id?: string
          quantity?: number
          unit_price_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_book_format_id_fkey"
            columns: ["book_format_id"]
            isOneToOne: false
            referencedRelation: "book_formats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          billing_address_id: string | null
          created_at: string
          currency: string
          deleted_at: string | null
          discount_amount: number
          discount_code_id: string | null
          guest_email: string | null
          id: string
          internal_notes: string | null
          order_number: string
          placed_at: string
          shipping_address_id: string | null
          shipping_amount: number
          status: Database["public"]["Enums"]["order_status"]
          subtotal_amount: number
          tax_amount: number
          total_amount: number
          tracking_number: string | null
          tracking_url: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          billing_address_id?: string | null
          created_at?: string
          currency?: string
          deleted_at?: string | null
          discount_amount?: number
          discount_code_id?: string | null
          guest_email?: string | null
          id?: string
          internal_notes?: string | null
          order_number?: string
          placed_at?: string
          shipping_address_id?: string | null
          shipping_amount?: number
          status?: Database["public"]["Enums"]["order_status"]
          subtotal_amount: number
          tax_amount?: number
          total_amount: number
          tracking_number?: string | null
          tracking_url?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          billing_address_id?: string | null
          created_at?: string
          currency?: string
          deleted_at?: string | null
          discount_amount?: number
          discount_code_id?: string | null
          guest_email?: string | null
          id?: string
          internal_notes?: string | null
          order_number?: string
          placed_at?: string
          shipping_address_id?: string | null
          shipping_amount?: number
          status?: Database["public"]["Enums"]["order_status"]
          subtotal_amount?: number
          tax_amount?: number
          total_amount?: number
          tracking_number?: string | null
          tracking_url?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_billing_address_id_fkey"
            columns: ["billing_address_id"]
            isOneToOne: false
            referencedRelation: "shipping_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_discount_code_id_fkey"
            columns: ["discount_code_id"]
            isOneToOne: false
            referencedRelation: "discount_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_shipping_address_id_fkey"
            columns: ["shipping_address_id"]
            isOneToOne: false
            referencedRelation: "shipping_addresses"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          failure_message: string | null
          id: string
          order_id: string
          provider: string
          provider_charge_id: string | null
          provider_payment_intent_id: string | null
          raw_response: Json | null
          refunded_amount: number
          status: Database["public"]["Enums"]["payment_status"]
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          failure_message?: string | null
          id?: string
          order_id: string
          provider?: string
          provider_charge_id?: string | null
          provider_payment_intent_id?: string | null
          raw_response?: Json | null
          refunded_amount?: number
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          failure_message?: string | null
          id?: string
          order_id?: string
          provider?: string
          provider_charge_id?: string | null
          provider_payment_intent_id?: string | null
          raw_response?: Json | null
          refunded_amount?: number
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      press_items: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_featured: boolean
          is_published: boolean
          position: number
          publication_name: string | null
          published_date: string | null
          title: string
          type: Database["public"]["Enums"]["press_item_type"]
          updated_at: string
          url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_featured?: boolean
          is_published?: boolean
          position?: number
          publication_name?: string | null
          published_date?: string | null
          title: string
          type: Database["public"]["Enums"]["press_item_type"]
          updated_at?: string
          url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_featured?: boolean
          is_published?: boolean
          position?: number
          publication_name?: string | null
          published_date?: string | null
          title?: string
          type?: Database["public"]["Enums"]["press_item_type"]
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      shipping_addresses: {
        Row: {
          address_line1: string
          address_line2: string | null
          city: string
          country: string
          created_at: string
          full_name: string
          id: string
          phone: string | null
          postal_code: string
          region: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          city: string
          country: string
          created_at?: string
          full_name: string
          id?: string
          phone?: string | null
          postal_code: string
          region?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          city?: string
          country?: string
          created_at?: string
          full_name?: string
          id?: string
          phone?: string | null
          postal_code?: string
          region?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          updated_by?: string | null
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      speaking_calendar_entries: {
        Row: {
          created_at: string
          entry_date: string
          event_id: string | null
          id: string
          note: string | null
          status: Database["public"]["Enums"]["speaking_calendar_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          entry_date: string
          event_id?: string | null
          id?: string
          note?: string | null
          status: Database["public"]["Enums"]["speaking_calendar_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          entry_date?: string
          event_id?: string | null
          id?: string
          note?: string | null
          status?: Database["public"]["Enums"]["speaking_calendar_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "speaking_calendar_entries_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "speaking_events"
            referencedColumns: ["id"]
          },
        ]
      }
      speaking_enquiries: {
        Row: {
          admin_notes: string | null
          audience_size: number | null
          budget_range: string | null
          contact_name: string
          country: string | null
          created_at: string
          email: string
          event_date: string | null
          event_type: string
          id: string
          notes: string | null
          organisation: string
          phone: string | null
          preferred_topic_id: string | null
          status: Database["public"]["Enums"]["speaking_enquiry_status"]
          updated_at: string
          venue: string | null
        }
        Insert: {
          admin_notes?: string | null
          audience_size?: number | null
          budget_range?: string | null
          contact_name: string
          country?: string | null
          created_at?: string
          email: string
          event_date?: string | null
          event_type: string
          id?: string
          notes?: string | null
          organisation: string
          phone?: string | null
          preferred_topic_id?: string | null
          status?: Database["public"]["Enums"]["speaking_enquiry_status"]
          updated_at?: string
          venue?: string | null
        }
        Update: {
          admin_notes?: string | null
          audience_size?: number | null
          budget_range?: string | null
          contact_name?: string
          country?: string | null
          created_at?: string
          email?: string
          event_date?: string | null
          event_type?: string
          id?: string
          notes?: string | null
          organisation?: string
          phone?: string | null
          preferred_topic_id?: string | null
          status?: Database["public"]["Enums"]["speaking_enquiry_status"]
          updated_at?: string
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "speaking_enquiries_preferred_topic_id_fkey"
            columns: ["preferred_topic_id"]
            isOneToOne: false
            referencedRelation: "speaking_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      speaking_events: {
        Row: {
          client: string
          created_at: string
          enquiry_id: string | null
          event_date: string
          expenses_amount: number | null
          fee_amount: number | null
          id: string
          is_public: boolean
          notes: string | null
          presentation_storage_path: string | null
          topic_id: string | null
          updated_at: string
          venue: string | null
        }
        Insert: {
          client: string
          created_at?: string
          enquiry_id?: string | null
          event_date: string
          expenses_amount?: number | null
          fee_amount?: number | null
          id?: string
          is_public?: boolean
          notes?: string | null
          presentation_storage_path?: string | null
          topic_id?: string | null
          updated_at?: string
          venue?: string | null
        }
        Update: {
          client?: string
          created_at?: string
          enquiry_id?: string | null
          event_date?: string
          expenses_amount?: number | null
          fee_amount?: number | null
          id?: string
          is_public?: boolean
          notes?: string | null
          presentation_storage_path?: string | null
          topic_id?: string | null
          updated_at?: string
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "speaking_events_enquiry_id_fkey"
            columns: ["enquiry_id"]
            isOneToOne: false
            referencedRelation: "speaking_enquiries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "speaking_events_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "speaking_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      speaking_topic_faqs: {
        Row: {
          answer: string
          created_at: string
          id: string
          position: number
          question: string
          topic_id: string
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          position?: number
          question: string
          topic_id: string
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          position?: number
          question?: string
          topic_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "speaking_topic_faqs_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "speaking_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      speaking_topics: {
        Row: {
          audience: string | null
          created_at: string
          delivery_format: string[]
          duration: string | null
          id: string
          is_featured: boolean
          is_published: boolean
          learning_objectives: string[]
          position: number
          slug: string
          summary: string
          title: string
          updated_at: string
        }
        Insert: {
          audience?: string | null
          created_at?: string
          delivery_format?: string[]
          duration?: string | null
          id?: string
          is_featured?: boolean
          is_published?: boolean
          learning_objectives?: string[]
          position?: number
          slug: string
          summary: string
          title: string
          updated_at?: string
        }
        Update: {
          audience?: string | null
          created_at?: string
          delivery_format?: string[]
          duration?: string | null
          id?: string
          is_featured?: boolean
          is_published?: boolean
          learning_objectives?: string[]
          position?: number
          slug?: string
          summary?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          author_name: string
          author_role: string | null
          category: Database["public"]["Enums"]["testimonial_category"]
          created_at: string
          id: string
          is_approved: boolean
          is_featured: boolean
          organisation: string | null
          quote: string
          updated_at: string
        }
        Insert: {
          author_name: string
          author_role?: string | null
          category: Database["public"]["Enums"]["testimonial_category"]
          created_at?: string
          id?: string
          is_approved?: boolean
          is_featured?: boolean
          organisation?: string | null
          quote: string
          updated_at?: string
        }
        Update: {
          author_name?: string
          author_role?: string | null
          category?: Database["public"]["Enums"]["testimonial_category"]
          created_at?: string
          id?: string
          is_approved?: boolean
          is_featured?: boolean
          organisation?: string | null
          quote?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          role: Database["public"]["Enums"]["admin_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          role: Database["public"]["Enums"]["admin_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          role?: Database["public"]["Enums"]["admin_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          is_featured: boolean
          is_published: boolean
          platform: Database["public"]["Enums"]["video_platform"]
          position: number
          storage_path: string | null
          thumbnail_storage_path: string | null
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_featured?: boolean
          is_published?: boolean
          platform: Database["public"]["Enums"]["video_platform"]
          position?: number
          storage_path?: string | null
          thumbnail_storage_path?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_featured?: boolean
          is_published?: boolean
          platform?: Database["public"]["Enums"]["video_platform"]
          position?: number
          storage_path?: string | null
          thumbnail_storage_path?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_manage_commerce: { Args: never; Returns: boolean }
      current_admin_role: {
        Args: never
        Returns: Database["public"]["Enums"]["admin_role"]
      }
      decrement_inventory: {
        Args: { p_book_format_id: string; p_quantity: number }
        Returns: undefined
      }
      generate_order_number: { Args: never; Returns: string }
      is_admin: { Args: never; Returns: boolean }
      is_super_admin: { Args: never; Returns: boolean }
      merge_guest_basket: {
        Args: { p_guest_basket_id: string; p_user_id: string }
        Returns: string
      }
    }
    Enums: {
      admin_role: "super_admin" | "administrator" | "editor"
      basket_status: "active" | "converted" | "abandoned"
      blog_post_status: "draft" | "scheduled" | "published"
      book_format_type:
        | "paperback"
        | "hardcover"
        | "ebook"
        | "audiobook"
        | "signed"
        | "bundle"
      book_status: "draft" | "published" | "archived"
      discount_type: "percentage" | "fixed_amount"
      faq_category:
        | "book-orders"
        | "delivery"
        | "digital-downloads"
        | "refunds"
        | "speaking-engagements"
        | "travel"
        | "courses"
        | "media-enquiries"
        | "general-enquiries"
      media_file_type: "image" | "pdf" | "epub" | "video" | "audio" | "other"
      order_status:
        | "pending"
        | "paid"
        | "processing"
        | "shipped"
        | "delivered"
        | "completed"
        | "cancelled"
        | "refunded"
      payment_status:
        | "pending"
        | "succeeded"
        | "failed"
        | "refunded"
        | "partially_refunded"
      press_item_type:
        | "interview"
        | "podcast"
        | "publication"
        | "video"
        | "press_release"
      speaking_calendar_status: "blocked" | "reserved" | "confirmed"
      speaking_enquiry_status:
        | "new"
        | "contacted"
        | "discovery"
        | "proposal_sent"
        | "negotiating"
        | "confirmed"
        | "delivered"
        | "closed"
      stock_status: "in_stock" | "low_stock" | "preorder" | "out_of_stock"
      testimonial_category:
        | "conferences"
        | "leadership"
        | "corporate"
        | "training"
        | "books"
      video_platform: "youtube" | "vimeo" | "upload"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      admin_role: ["super_admin", "administrator", "editor"],
      basket_status: ["active", "converted", "abandoned"],
      blog_post_status: ["draft", "scheduled", "published"],
      book_format_type: [
        "paperback",
        "hardcover",
        "ebook",
        "audiobook",
        "signed",
        "bundle",
      ],
      book_status: ["draft", "published", "archived"],
      discount_type: ["percentage", "fixed_amount"],
      faq_category: [
        "book-orders",
        "delivery",
        "digital-downloads",
        "refunds",
        "speaking-engagements",
        "travel",
        "courses",
        "media-enquiries",
        "general-enquiries",
      ],
      media_file_type: ["image", "pdf", "epub", "video", "audio", "other"],
      order_status: [
        "pending",
        "paid",
        "processing",
        "shipped",
        "delivered",
        "completed",
        "cancelled",
        "refunded",
      ],
      payment_status: [
        "pending",
        "succeeded",
        "failed",
        "refunded",
        "partially_refunded",
      ],
      press_item_type: [
        "interview",
        "podcast",
        "publication",
        "video",
        "press_release",
      ],
      speaking_calendar_status: ["blocked", "reserved", "confirmed"],
      speaking_enquiry_status: [
        "new",
        "contacted",
        "discovery",
        "proposal_sent",
        "negotiating",
        "confirmed",
        "delivered",
        "closed",
      ],
      stock_status: ["in_stock", "low_stock", "preorder", "out_of_stock"],
      testimonial_category: [
        "conferences",
        "leadership",
        "corporate",
        "training",
        "books",
      ],
      video_platform: ["youtube", "vimeo", "upload"],
    },
  },
} as const

// Convenience aliases for the public schema's enums, used throughout the
// app instead of the more verbose Database["public"]["Enums"][...] form.
// Derived from the generated Enums above so they can't drift from the
// real schema.
type Enum<Name extends keyof Database["public"]["Enums"]> = Database["public"]["Enums"][Name];

export type BookStatus = Enum<"book_status">;
export type BookFormatType = Enum<"book_format_type">;
export type StockStatus = Enum<"stock_status">;
export type BasketStatus = Enum<"basket_status">;
export type OrderStatus = Enum<"order_status">;
export type PaymentStatus = Enum<"payment_status">;
export type DiscountType = Enum<"discount_type">;
export type AdminRole = Enum<"admin_role">;
export type BlogPostStatus = Enum<"blog_post_status">;
export type MediaFileType = Enum<"media_file_type">;
export type TestimonialCategory = Enum<"testimonial_category">;
export type FaqCategory = Enum<"faq_category">;
export type SpeakingEnquiryStatus = Enum<"speaking_enquiry_status">;
export type SpeakingCalendarStatus = Enum<"speaking_calendar_status">;
export type PressItemType = Enum<"press_item_type">;
export type VideoPlatform = Enum<"video_platform">;
