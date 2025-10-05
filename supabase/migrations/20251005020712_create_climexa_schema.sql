/*
  # CLIMEXA Database Schema - Initial Setup

  ## Overview
  This migration creates the complete database structure for CLIMEXA, a climate and astronomical events planning application.

  ## New Tables

  ### 1. `profiles`
  User profile information extending auth.users
  - `id` (uuid, references auth.users)
  - `username` (text, unique)
  - `full_name` (text)
  - `avatar_url` (text)
  - `preferences` (jsonb) - stores user preferences for notifications, units, etc.
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. `astronomical_events`
  Tracks upcoming astronomical events
  - `id` (uuid, primary key)
  - `event_type` (text) - luna_llena, luna_nueva, eclipse, superluna, lluvia_meteoros
  - `event_name` (text)
  - `event_date` (timestamptz)
  - `description` (text)
  - `visibility_data` (jsonb) - stores visibility predictions per location
  - `image_url` (text)
  - `created_at` (timestamptz)

  ### 3. `planned_events`
  User-created events and activities
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `title` (text)
  - `event_type` (text) - senderismo, camping, fotografia, observacion, etc.
  - `location_name` (text)
  - `latitude` (numeric)
  - `longitude` (numeric)
  - `event_date` (timestamptz)
  - `event_time` (time)
  - `weather_data` (jsonb) - stores weather predictions
  - `ai_recommendations` (text)
  - `status` (text) - planned, completed, cancelled
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 4. `locations`
  Popular locations with historical climate data
  - `id` (uuid, primary key)
  - `name` (text)
  - `description` (text)
  - `latitude` (numeric)
  - `longitude` (numeric)
  - `elevation` (numeric)
  - `terrain_type` (text)
  - `climate_data` (jsonb) - historical averages
  - `image_url` (text)
  - `created_at` (timestamptz)

  ### 5. `reviews`
  Community reviews and experiences
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `location_id` (uuid, references locations)
  - `planned_event_id` (uuid, references planned_events, nullable)
  - `rating` (integer) - 1 to 5
  - `comment` (text)
  - `weather_conditions` (jsonb)
  - `photos` (text[]) - array of photo URLs
  - `visit_date` (date)
  - `created_at` (timestamptz)

  ### 6. `alerts`
  Weather and astronomical alerts for users
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `alert_type` (text) - weather, astronomical, recommendation
  - `title` (text)
  - `message` (text)
  - `severity` (text) - info, warning, critical
  - `is_read` (boolean)
  - `related_event_id` (uuid, nullable)
  - `created_at` (timestamptz)

  ## Security
  - Row Level Security (RLS) is enabled on all tables
  - Users can only read their own profiles, events, and alerts
  - Reviews and astronomical events are publicly readable
  - Only authenticated users can create content
  - Users can only modify their own content
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  preferences jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create astronomical_events table
CREATE TABLE IF NOT EXISTS astronomical_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  event_name text NOT NULL,
  event_date timestamptz NOT NULL,
  description text,
  visibility_data jsonb DEFAULT '{}'::jsonb,
  image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE astronomical_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Astronomical events are publicly readable"
  ON astronomical_events FOR SELECT
  TO authenticated
  USING (true);

-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  elevation numeric,
  terrain_type text,
  climate_data jsonb DEFAULT '{}'::jsonb,
  image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Locations are publicly readable"
  ON locations FOR SELECT
  TO authenticated
  USING (true);

-- Create planned_events table
CREATE TABLE IF NOT EXISTS planned_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  event_type text NOT NULL,
  location_name text NOT NULL,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  event_date date NOT NULL,
  event_time time,
  weather_data jsonb DEFAULT '{}'::jsonb,
  ai_recommendations text,
  status text DEFAULT 'planned',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE planned_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own planned events"
  ON planned_events FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own planned events"
  ON planned_events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own planned events"
  ON planned_events FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own planned events"
  ON planned_events FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  location_id uuid REFERENCES locations(id) ON DELETE CASCADE,
  planned_event_id uuid REFERENCES planned_events(id) ON DELETE SET NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  weather_conditions jsonb DEFAULT '{}'::jsonb,
  photos text[] DEFAULT ARRAY[]::text[],
  visit_date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are publicly readable"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  alert_type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  severity text DEFAULT 'info',
  is_read boolean DEFAULT false,
  related_event_id uuid,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own alerts"
  ON alerts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts"
  ON alerts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_astronomical_events_date ON astronomical_events(event_date);
CREATE INDEX IF NOT EXISTS idx_planned_events_user ON planned_events(user_id);
CREATE INDEX IF NOT EXISTS idx_planned_events_date ON planned_events(event_date);
CREATE INDEX IF NOT EXISTS idx_reviews_location ON reviews(location_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_user ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_unread ON alerts(user_id, is_read) WHERE is_read = false;