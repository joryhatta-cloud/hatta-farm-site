import { mysqlTable, int, varchar, text, boolean, timestamp, json } from 'drizzle-orm/mysql-core';

// ── Properties (Accommodations) ───────────────────────────────────────────────
export const properties = mysqlTable('properties', {
  id:              int('id').primaryKey().autoincrement(),
  slug:            varchar('slug', { length: 120 }).notNull().unique(),
  category:        varchar('category', { length: 60 }).notNull(), // resort|chalet|farm-stay|holiday-home|room|event-stay
  nameEn:          varchar('name_en', { length: 255 }).notNull(),
  nameAr:          varchar('name_ar', { length: 255 }).notNull(),
  descriptionEn:   text('description_en'),
  descriptionAr:   text('description_ar'),
  locationEn:      varchar('location_en', { length: 255 }),
  locationAr:      varchar('location_ar', { length: 255 }),
  mapsUrl:         varchar('maps_url', { length: 500 }),
  bedrooms:        int('bedrooms').default(1),
  bathrooms:       int('bathrooms').default(1),
  maxGuests:       int('max_guests').default(2),
  hasPool:         boolean('has_pool').default(false),
  hasBreakfast:    boolean('has_breakfast').default(false),
  hasKitchen:      boolean('has_kitchen').default(true),
  hasBbq:          boolean('has_bbq').default(false),
  hasHousekeeping: boolean('has_housekeeping').default(false),
  pricePerNight:   varchar('price_per_night', { length: 60 }),
  whatsappNumber:  varchar('whatsapp_number', { length: 30 }).default('971501848844'),
  amenities:       json('amenities').$type<string[]>().default([]),
  images:          json('images').$type<string[]>().default([]),
  featured:        boolean('featured').default(false),
  active:          boolean('active').default(true),
});

export type Property = typeof properties.$inferSelect;
export type NewProperty = typeof properties.$inferInsert;

// ── BetterAuth Tables ─────────────────────────────────────────────────────────
export const user = mysqlTable('user', {
  id:            varchar('id', { length: 36 }).primaryKey(),
  name:          varchar('name', { length: 255 }),
  email:         varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: boolean('email_verified').default(false),
  image:         text('image'),
  isAdmin:       boolean('is_admin').default(false),
  createdAt:     timestamp('created_at').defaultNow(),
  updatedAt:     timestamp('updated_at').defaultNow().onUpdateNow(),
});

export const session = mysqlTable('session', {
  id:          varchar('id', { length: 36 }).primaryKey(),
  expiresAt:   timestamp('expires_at').notNull(),
  token:       varchar('token', { length: 255 }).notNull().unique(),
  ipAddress:   varchar('ip_address', { length: 45 }),
  userAgent:   text('user_agent'),
  userId:      varchar('user_id', { length: 36 }).notNull().references(() => user.id, { onDelete: 'cascade' }),
  createdAt:   timestamp('created_at').defaultNow(),
  updatedAt:   timestamp('updated_at').defaultNow().onUpdateNow(),
});

export const account = mysqlTable('account', {
  id:                       varchar('id', { length: 36 }).primaryKey(),
  accountId:                varchar('account_id', { length: 255 }).notNull(),
  providerId:               varchar('provider_id', { length: 255 }).notNull(),
  userId:                   varchar('user_id', { length: 36 }).notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken:              text('access_token'),
  refreshToken:             text('refresh_token'),
  idToken:                  text('id_token'),
  accessTokenExpiresAt:     timestamp('access_token_expires_at'),
  refreshTokenExpiresAt:    timestamp('refresh_token_expires_at'),
  scope:                    text('scope'),
  password:                 varchar('password', { length: 255 }),
  createdAt:                timestamp('created_at').defaultNow(),
  updatedAt:                timestamp('updated_at').defaultNow().onUpdateNow(),
});

export const verification = mysqlTable('verification', {
  id:         varchar('id', { length: 36 }).primaryKey(),
  identifier: varchar('identifier', { length: 255 }).notNull(),
  value:      varchar('value', { length: 255 }).notNull(),
  expiresAt:  timestamp('expires_at').notNull(),
  createdAt:  timestamp('created_at').defaultNow(),
  updatedAt:  timestamp('updated_at').defaultNow().onUpdateNow(),
});

// ── Analytics ────────────────────────────────────────────────────────────────
export const pageViews = mysqlTable('page_views', {
  id:        int('id').autoincrement().primaryKey(),
  path:      varchar('path', { length: 500 }).notNull(),
  referrer:  varchar('referrer', { length: 500 }),
  userAgent: varchar('user_agent', { length: 500 }),
  country:   varchar('country', { length: 10 }),
  sessionId: varchar('session_id', { length: 64 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
