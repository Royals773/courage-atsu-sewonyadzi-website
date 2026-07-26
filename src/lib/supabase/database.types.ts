/**
 * Hand-written to match supabase/migrations/*.sql exactly (no live Supabase
 * project was available to run `supabase gen types typescript` against —
 * see the Step 3 report). Regenerate with the CLI once a project is linked;
 * the shape should not change unless the schema does.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type BookStatus = "draft" | "published" | "archived";
export type BookFormatType =
  | "paperback"
  | "hardcover"
  | "ebook"
  | "audiobook"
  | "signed"
  | "bundle";
export type StockStatus = "in_stock" | "low_stock" | "preorder" | "out_of_stock";
export type BasketStatus = "active" | "converted" | "abandoned";
export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "completed"
  | "cancelled"
  | "refunded";
export type PaymentStatus =
  | "pending"
  | "succeeded"
  | "failed"
  | "refunded"
  | "partially_refunded";
export type DiscountType = "percentage" | "fixed_amount";
export type AdminRole = "super_admin" | "administrator" | "editor";
export type BlogPostStatus = "draft" | "scheduled" | "published";
export type MediaFileType = "image" | "pdf" | "epub" | "video" | "audio" | "other";
export type TestimonialCategory =
  | "conferences"
  | "leadership"
  | "corporate"
  | "training"
  | "books";
export type FaqCategory =
  | "book-orders"
  | "delivery"
  | "digital-downloads"
  | "refunds"
  | "speaking-engagements"
  | "travel"
  | "courses"
  | "media-enquiries"
  | "general-enquiries";
export type SpeakingEnquiryStatus =
  | "new"
  | "contacted"
  | "discovery"
  | "proposal_sent"
  | "negotiating"
  | "confirmed"
  | "delivered"
  | "closed";
export type SpeakingCalendarStatus = "blocked" | "reserved" | "confirmed";
export type PressItemType =
  | "interview"
  | "podcast"
  | "publication"
  | "video"
  | "press_release";
export type VideoPlatform = "youtube" | "vimeo" | "upload";

export interface TableOfContentsEntryRow {
  title: string;
}

// Every table below carries a literal `Relationships` tuple. This is
// required by @supabase/postgrest-js's type-level query parser to resolve
// embedded/joined `.select()` strings (e.g. `book_formats(*, inventory(*))`)
// — without an accurate Relationships array per table, embedded selects
// resolve to a SelectQueryError instead of a real type.

export interface Database {
  // Required by @supabase/postgrest-js's type inference (recent versions
  // branch their generic parsing on this marker — `supabase gen types`
  // emits it automatically; without it, typed `.select()` string parsing
  // silently falls back to `never`).
  __InternalSupabase: {
    PostgrestVersion: "13";
  };
  public: {
    Tables: {
      book_categories: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["book_categories"]["Insert"]>;
        Relationships: [];
      };
      books: {
        Row: {
          id: string;
          slug: string;
          title: string;
          subtitle: string | null;
          description: string | null;
          author_note: string | null;
          key_lessons: string[];
          who_its_for: string[];
          table_of_contents: TableOfContentsEntryRow[];
          publication_date: string | null;
          featured: boolean;
          is_new: boolean;
          has_sample_chapter: boolean;
          sample_chapter_storage_path: string | null;
          status: BookStatus;
          popularity_score: number;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          subtitle?: string | null;
          description?: string | null;
          author_note?: string | null;
          key_lessons?: string[];
          who_its_for?: string[];
          table_of_contents?: TableOfContentsEntryRow[];
          publication_date?: string | null;
          featured?: boolean;
          is_new?: boolean;
          has_sample_chapter?: boolean;
          sample_chapter_storage_path?: string | null;
          status?: BookStatus;
          popularity_score?: number;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["books"]["Insert"]>;
        Relationships: [];
      };
      book_category_books: {
        Row: { book_id: string; category_id: string; created_at: string };
        Insert: { book_id: string; category_id: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["book_category_books"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "book_category_books_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "books";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "book_category_books_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "book_categories";
            referencedColumns: ["id"];
          },
        ];
      };
      book_formats: {
        Row: {
          id: string;
          book_id: string;
          format_type: BookFormatType;
          label: string;
          price_amount: number;
          currency: string;
          is_digital: boolean;
          sku: string | null;
          is_active: boolean;
          digital_file_storage_path: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          book_id: string;
          format_type: BookFormatType;
          label: string;
          price_amount: number;
          currency?: string;
          is_digital?: boolean;
          sku?: string | null;
          is_active?: boolean;
          digital_file_storage_path?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["book_formats"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "book_formats_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "books";
            referencedColumns: ["id"];
          },
        ];
      };
      book_images: {
        Row: {
          id: string;
          book_id: string;
          storage_path: string;
          alt_text: string | null;
          position: number;
          is_cover: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          book_id: string;
          storage_path: string;
          alt_text?: string | null;
          position?: number;
          is_cover?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["book_images"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "book_images_book_id_fkey";
            columns: ["book_id"];
            isOneToOne: false;
            referencedRelation: "books";
            referencedColumns: ["id"];
          },
        ];
      };
      inventory: {
        Row: {
          id: string;
          book_format_id: string;
          tracks_stock: boolean;
          quantity_on_hand: number | null;
          quantity_reserved: number;
          reorder_threshold: number;
          stock_status: StockStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          book_format_id: string;
          tracks_stock?: boolean;
          quantity_on_hand?: number | null;
          quantity_reserved?: number;
          reorder_threshold?: number;
          stock_status?: StockStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["inventory"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "inventory_book_format_id_fkey";
            columns: ["book_format_id"];
            isOneToOne: true;
            referencedRelation: "book_formats";
            referencedColumns: ["id"];
          },
        ];
      };
      baskets: {
        Row: {
          id: string;
          user_id: string | null;
          session_token: string | null;
          status: BasketStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          session_token?: string | null;
          status?: BasketStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["baskets"]["Insert"]>;
        Relationships: [];
      };
      basket_items: {
        Row: {
          id: string;
          basket_id: string;
          book_format_id: string;
          quantity: number;
          unit_price_amount: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          basket_id: string;
          book_format_id: string;
          quantity?: number;
          unit_price_amount: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["basket_items"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "basket_items_basket_id_fkey";
            columns: ["basket_id"];
            isOneToOne: false;
            referencedRelation: "baskets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "basket_items_book_format_id_fkey";
            columns: ["book_format_id"];
            isOneToOne: false;
            referencedRelation: "book_formats";
            referencedColumns: ["id"];
          },
        ];
      };
      discount_codes: {
        Row: {
          id: string;
          code: string;
          description: string | null;
          discount_type: DiscountType;
          discount_value: number;
          currency: string;
          max_redemptions: number | null;
          times_redeemed: number;
          starts_at: string | null;
          expires_at: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          description?: string | null;
          discount_type: DiscountType;
          discount_value: number;
          currency?: string;
          max_redemptions?: number | null;
          times_redeemed?: number;
          starts_at?: string | null;
          expires_at?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["discount_codes"]["Insert"]>;
        Relationships: [];
      };
      shipping_addresses: {
        Row: {
          id: string;
          user_id: string | null;
          full_name: string;
          address_line1: string;
          address_line2: string | null;
          city: string;
          region: string | null;
          postal_code: string;
          country: string;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          full_name: string;
          address_line1: string;
          address_line2?: string | null;
          city: string;
          region?: string | null;
          postal_code: string;
          country: string;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["shipping_addresses"]["Insert"]>;
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string | null;
          guest_email: string | null;
          status: OrderStatus;
          subtotal_amount: number;
          discount_amount: number;
          shipping_amount: number;
          tax_amount: number;
          total_amount: number;
          currency: string;
          discount_code_id: string | null;
          shipping_address_id: string | null;
          billing_address_id: string | null;
          tracking_number: string | null;
          tracking_url: string | null;
          internal_notes: string | null;
          placed_at: string;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number?: string;
          user_id?: string | null;
          guest_email?: string | null;
          status?: OrderStatus;
          subtotal_amount: number;
          discount_amount?: number;
          shipping_amount?: number;
          tax_amount?: number;
          total_amount: number;
          currency?: string;
          discount_code_id?: string | null;
          shipping_address_id?: string | null;
          billing_address_id?: string | null;
          tracking_number?: string | null;
          tracking_url?: string | null;
          internal_notes?: string | null;
          placed_at?: string;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "orders_discount_code_id_fkey";
            columns: ["discount_code_id"];
            isOneToOne: false;
            referencedRelation: "discount_codes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_shipping_address_id_fkey";
            columns: ["shipping_address_id"];
            isOneToOne: false;
            referencedRelation: "shipping_addresses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_billing_address_id_fkey";
            columns: ["billing_address_id"];
            isOneToOne: false;
            referencedRelation: "shipping_addresses";
            referencedColumns: ["id"];
          },
        ];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          book_format_id: string | null;
          book_title: string;
          format_label: string;
          is_digital: boolean;
          unit_price_amount: number;
          quantity: number;
          line_total_amount: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          book_format_id?: string | null;
          book_title: string;
          format_label: string;
          is_digital?: boolean;
          unit_price_amount: number;
          quantity: number;
          line_total_amount: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_book_format_id_fkey";
            columns: ["book_format_id"];
            isOneToOne: false;
            referencedRelation: "book_formats";
            referencedColumns: ["id"];
          },
        ];
      };
      payments: {
        Row: {
          id: string;
          order_id: string;
          provider: string;
          provider_payment_intent_id: string | null;
          provider_charge_id: string | null;
          status: PaymentStatus;
          amount: number;
          currency: string;
          failure_message: string | null;
          refunded_amount: number;
          raw_response: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          provider?: string;
          provider_payment_intent_id?: string | null;
          provider_charge_id?: string | null;
          status?: PaymentStatus;
          amount: number;
          currency?: string;
          failure_message?: string | null;
          refunded_amount?: number;
          raw_response?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["payments"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      digital_downloads: {
        Row: {
          id: string;
          order_item_id: string;
          book_format_id: string;
          storage_path: string;
          download_token: string;
          expires_at: string;
          max_downloads: number;
          download_count: number;
          last_downloaded_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_item_id: string;
          book_format_id: string;
          storage_path: string;
          download_token?: string;
          expires_at?: string;
          max_downloads?: number;
          download_count?: number;
          last_downloaded_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["digital_downloads"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "digital_downloads_order_item_id_fkey";
            columns: ["order_item_id"];
            isOneToOne: false;
            referencedRelation: "order_items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "digital_downloads_book_format_id_fkey";
            columns: ["book_format_id"];
            isOneToOne: false;
            referencedRelation: "book_formats";
            referencedColumns: ["id"];
          },
        ];
      };
      user_roles: {
        Row: {
          user_id: string;
          role: AdminRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          role: AdminRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_roles"]["Insert"]>;
        Relationships: [];
      };
      blog_categories: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["blog_categories"]["Insert"]>;
        Relationships: [];
      };
      blog_tags: {
        Row: {
          id: string;
          slug: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["blog_tags"]["Insert"]>;
        Relationships: [];
      };
      blog_posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string | null;
          content: string;
          category_id: string | null;
          author_id: string | null;
          featured_image_path: string | null;
          seo_title: string | null;
          seo_description: string | null;
          status: BlogPostStatus;
          published_at: string | null;
          scheduled_at: string | null;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          excerpt?: string | null;
          content?: string;
          category_id?: string | null;
          author_id?: string | null;
          featured_image_path?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          status?: BlogPostStatus;
          published_at?: string | null;
          scheduled_at?: string | null;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["blog_posts"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "blog_categories";
            referencedColumns: ["id"];
          },
        ];
      };
      blog_post_tags: {
        Row: { post_id: string; tag_id: string };
        Insert: { post_id: string; tag_id: string };
        Update: Partial<Database["public"]["Tables"]["blog_post_tags"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "blog_post_tags_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "blog_posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "blog_post_tags_tag_id_fkey";
            columns: ["tag_id"];
            isOneToOne: false;
            referencedRelation: "blog_tags";
            referencedColumns: ["id"];
          },
        ];
      };
      media_folders: {
        Row: {
          id: string;
          name: string;
          parent_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          parent_id?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["media_folders"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "media_folders_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "media_folders";
            referencedColumns: ["id"];
          },
        ];
      };
      media_items: {
        Row: {
          id: string;
          folder_id: string | null;
          file_name: string;
          storage_path: string;
          mime_type: string;
          file_type: MediaFileType;
          size_bytes: number;
          alt_text: string | null;
          uploaded_by: string | null;
          kit_category: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          folder_id?: string | null;
          file_name: string;
          storage_path: string;
          mime_type: string;
          file_type?: MediaFileType;
          size_bytes?: number;
          alt_text?: string | null;
          uploaded_by?: string | null;
          kit_category?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["media_items"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "media_items_folder_id_fkey";
            columns: ["folder_id"];
            isOneToOne: false;
            referencedRelation: "media_folders";
            referencedColumns: ["id"];
          },
        ];
      };
      testimonials: {
        Row: {
          id: string;
          quote: string;
          author_name: string;
          author_role: string | null;
          organisation: string | null;
          category: TestimonialCategory;
          is_approved: boolean;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          quote: string;
          author_name: string;
          author_role?: string | null;
          organisation?: string | null;
          category: TestimonialCategory;
          is_approved?: boolean;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["testimonials"]["Insert"]>;
        Relationships: [];
      };
      faq_items: {
        Row: {
          id: string;
          question: string;
          answer: string;
          category: FaqCategory;
          position: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          question: string;
          answer: string;
          category: FaqCategory;
          position?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["faq_items"]["Insert"]>;
        Relationships: [];
      };
      site_settings: {
        Row: {
          key: string;
          value: Json;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          key: string;
          value: Json;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["site_settings"]["Insert"]>;
        Relationships: [];
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          first_name: string | null;
          consent: boolean;
          source: string | null;
          tags: string[];
          subscribed_at: string;
          unsubscribed_at: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          first_name?: string | null;
          consent?: boolean;
          source?: string | null;
          tags?: string[];
          subscribed_at?: string;
          unsubscribed_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["newsletter_subscribers"]["Insert"]>;
        Relationships: [];
      };
      speaking_topics: {
        Row: {
          id: string;
          slug: string;
          title: string;
          summary: string;
          learning_objectives: string[];
          audience: string | null;
          duration: string | null;
          delivery_format: string[];
          is_featured: boolean;
          is_published: boolean;
          position: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          summary: string;
          learning_objectives?: string[];
          audience?: string | null;
          duration?: string | null;
          delivery_format?: string[];
          is_featured?: boolean;
          is_published?: boolean;
          position?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["speaking_topics"]["Insert"]>;
        Relationships: [];
      };
      speaking_topic_faqs: {
        Row: {
          id: string;
          topic_id: string;
          question: string;
          answer: string;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          topic_id: string;
          question: string;
          answer: string;
          position?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["speaking_topic_faqs"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "speaking_topic_faqs_topic_id_fkey";
            columns: ["topic_id"];
            isOneToOne: false;
            referencedRelation: "speaking_topics";
            referencedColumns: ["id"];
          },
        ];
      };
      speaking_enquiries: {
        Row: {
          id: string;
          organisation: string;
          contact_name: string;
          email: string;
          phone: string | null;
          event_type: string;
          venue: string | null;
          country: string | null;
          audience_size: number | null;
          event_date: string | null;
          budget_range: string | null;
          preferred_topic_id: string | null;
          notes: string | null;
          status: SpeakingEnquiryStatus;
          admin_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organisation: string;
          contact_name: string;
          email: string;
          phone?: string | null;
          event_type: string;
          venue?: string | null;
          country?: string | null;
          audience_size?: number | null;
          event_date?: string | null;
          budget_range?: string | null;
          preferred_topic_id?: string | null;
          notes?: string | null;
          status?: SpeakingEnquiryStatus;
          admin_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["speaking_enquiries"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "speaking_enquiries_preferred_topic_id_fkey";
            columns: ["preferred_topic_id"];
            isOneToOne: false;
            referencedRelation: "speaking_topics";
            referencedColumns: ["id"];
          },
        ];
      };
      speaking_events: {
        Row: {
          id: string;
          enquiry_id: string | null;
          topic_id: string | null;
          client: string;
          venue: string | null;
          event_date: string;
          fee_amount: number | null;
          expenses_amount: number | null;
          notes: string | null;
          presentation_storage_path: string | null;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          enquiry_id?: string | null;
          topic_id?: string | null;
          client: string;
          venue?: string | null;
          event_date: string;
          fee_amount?: number | null;
          expenses_amount?: number | null;
          notes?: string | null;
          presentation_storage_path?: string | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["speaking_events"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "speaking_events_enquiry_id_fkey";
            columns: ["enquiry_id"];
            isOneToOne: false;
            referencedRelation: "speaking_enquiries";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "speaking_events_topic_id_fkey";
            columns: ["topic_id"];
            isOneToOne: false;
            referencedRelation: "speaking_topics";
            referencedColumns: ["id"];
          },
        ];
      };
      speaking_calendar_entries: {
        Row: {
          id: string;
          entry_date: string;
          status: SpeakingCalendarStatus;
          event_id: string | null;
          note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          entry_date: string;
          status: SpeakingCalendarStatus;
          event_id?: string | null;
          note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["speaking_calendar_entries"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "speaking_calendar_entries_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "speaking_events";
            referencedColumns: ["id"];
          },
        ];
      };
      press_items: {
        Row: {
          id: string;
          title: string;
          type: PressItemType;
          publication_name: string | null;
          url: string | null;
          description: string | null;
          published_date: string | null;
          is_featured: boolean;
          is_published: boolean;
          position: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          type: PressItemType;
          publication_name?: string | null;
          url?: string | null;
          description?: string | null;
          published_date?: string | null;
          is_featured?: boolean;
          is_published?: boolean;
          position?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["press_items"]["Insert"]>;
        Relationships: [];
      };
      videos: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          platform: VideoPlatform;
          video_url: string | null;
          storage_path: string | null;
          thumbnail_storage_path: string | null;
          category: string | null;
          is_featured: boolean;
          is_published: boolean;
          position: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          platform: VideoPlatform;
          video_url?: string | null;
          storage_path?: string | null;
          thumbnail_storage_path?: string | null;
          category?: string | null;
          is_featured?: boolean;
          is_published?: boolean;
          position?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["videos"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      decrement_inventory: {
        Args: { p_book_format_id: string; p_quantity: number };
        Returns: undefined;
      };
      merge_guest_basket: {
        Args: { p_guest_basket_id: string | null; p_user_id: string };
        Returns: string;
      };
      generate_order_number: {
        Args: Record<string, never>;
        Returns: string;
      };
      current_admin_role: {
        Args: Record<string, never>;
        Returns: AdminRole | null;
      };
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      is_super_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      can_manage_commerce: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      book_status: BookStatus;
      book_format_type: BookFormatType;
      stock_status: StockStatus;
      basket_status: BasketStatus;
      order_status: OrderStatus;
      payment_status: PaymentStatus;
      discount_type: DiscountType;
      admin_role: AdminRole;
      blog_post_status: BlogPostStatus;
      media_file_type: MediaFileType;
      testimonial_category: TestimonialCategory;
      faq_category: FaqCategory;
      speaking_enquiry_status: SpeakingEnquiryStatus;
      speaking_calendar_status: SpeakingCalendarStatus;
      press_item_type: PressItemType;
      video_platform: VideoPlatform;
    };
  };
}
