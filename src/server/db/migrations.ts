import { db } from './client.js';
import { sql } from 'drizzle-orm';

/**
 * Ensures the properties table exists with the correct schema.
 * Safe to run on every startup — uses CREATE TABLE IF NOT EXISTS.
 */
export async function runMigrations(): Promise<void> {
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS properties (
        id INT PRIMARY KEY AUTO_INCREMENT,
        slug VARCHAR(120) NOT NULL UNIQUE,
        category VARCHAR(60) NOT NULL,
        name_en VARCHAR(255) NOT NULL,
        name_ar VARCHAR(255) NOT NULL,
        description_en TEXT,
        description_ar TEXT,
        location_en VARCHAR(255),
        location_ar VARCHAR(255),
        maps_url VARCHAR(500),
        bedrooms INT DEFAULT 1,
        bathrooms INT DEFAULT 1,
        max_guests INT DEFAULT 2,
        has_pool BOOLEAN DEFAULT FALSE,
        has_breakfast BOOLEAN DEFAULT FALSE,
        has_kitchen BOOLEAN DEFAULT TRUE,
        has_bbq BOOLEAN DEFAULT FALSE,
        has_housekeeping BOOLEAN DEFAULT FALSE,
        price_per_night VARCHAR(60),
        whatsapp_number VARCHAR(30) DEFAULT '971501848844',
        amenities JSON,
        images JSON,
        featured BOOLEAN DEFAULT FALSE,
        active BOOLEAN DEFAULT TRUE
      )
    `);

    // Seed initial properties if table is empty
    const [rows] = await db.execute(sql`SELECT COUNT(*) as cnt FROM properties`);
    const count = (rows as unknown as Array<{ cnt: number }>)[0]?.cnt ?? 0;
    if (count === 0) {
      await db.execute(sql`
        INSERT INTO properties (slug, category, name_en, name_ar, description_en, description_ar, location_en, location_ar, bedrooms, bathrooms, max_guests, has_pool, has_breakfast, price_per_night, amenities, images, featured, active) VALUES
        ('hatta-mountain-resort', 'resort', 'Hatta Mountain Resort', 'منتجع جبل حتا', 'A luxury mountain resort nestled in the Hajar Mountains with stunning views and world-class amenities.', 'منتجع فاخر في قلب جبال الحجر مع إطلالات خلابة ومرافق عالمية المستوى.', 'Hatta, Dubai', 'حتا، دبي', 4, 3, 8, TRUE, TRUE, 'AED 1,200/night', '["WiFi","Pool","Gym","Spa","Restaurant"]', '["/airo-assets/images/properties/hatta-mountain-resort"]', TRUE, TRUE),
        ('al-hajar-chalets', 'chalet', 'Al Hajar Chalets', 'شاليهات الحجر', 'Private stone chalets with panoramic mountain views and private pools, perfect for family getaways.', 'شاليهات حجرية خاصة مع إطلالات بانورامية على الجبال وحمامات سباحة خاصة.', 'Hatta, Dubai', 'حتا، دبي', 3, 2, 6, TRUE, FALSE, 'AED 850/night', '["WiFi","Private Pool","BBQ","Kitchen"]', '["/airo-assets/images/properties/al-hajar-chalets"]', TRUE, TRUE),
        ('hatta-farm-retreat', 'farm-stay', 'Hatta Farm Retreat', 'مزرعة حتا للاستجمام', 'An authentic farm stay experience surrounded by date palms and mountain scenery.', 'تجربة إقامة مزرعة أصيلة محاطة بأشجار النخيل والمناظر الجبلية.', 'Hatta, Dubai', 'حتا، دبي', 2, 1, 4, FALSE, TRUE, 'AED 550/night', '["WiFi","Farm Tour","Breakfast","Kitchen"]', '["/airo-assets/images/properties/hatta-farm-retreat"]', TRUE, TRUE),
        ('hatta-highland-villa', 'holiday-home', 'Hatta Highland Villa', 'فيلا هايلاند حتا', 'A luxurious private villa with a private pool, garden, and breathtaking mountain backdrop.', 'فيلا خاصة فاخرة مع حمام سباحة خاص وحديقة وخلفية جبلية رائعة.', 'Hatta, Dubai', 'حتا، دبي', 5, 4, 10, TRUE, FALSE, 'AED 2,500/night', '["WiFi","Private Pool","Garden","BBQ","Kitchen","Housekeeping"]', '["/airo-assets/images/properties/hatta-highland-villa"]', TRUE, TRUE),
        ('mountain-view-rooms', 'room', 'Mountain View Rooms', 'غرف إطلالة الجبل', 'Cozy mountain view rooms with elegant interiors and easy access to Hatta attractions.', 'غرف مريحة بإطلالة على الجبل مع ديكورات أنيقة وسهولة الوصول إلى معالم حتا.', 'Hatta, Dubai', 'حتا، دبي', 1, 1, 2, FALSE, TRUE, 'AED 350/night', '["WiFi","Breakfast","AC","TV"]', '["/airo-assets/images/properties/mountain-view-rooms"]', FALSE, TRUE),
        ('hatta-events-estate', 'event-stay', 'Hatta Events Estate', 'مجمع فعاليات حتا', 'A grand estate perfect for weddings, corporate events, and private celebrations in the mountains.', 'مجمع فاخر مثالي للأفراح والفعاليات المؤسسية والاحتفالات الخاصة في الجبال.', 'Hatta, Dubai', 'حتا، دبي', 6, 5, 50, TRUE, TRUE, 'AED 5,000/event', '["WiFi","Event Hall","Catering","Pool","Parking"]', '["/airo-assets/images/properties/hatta-events-estate"]', TRUE, TRUE),
        ('green-valley-farm-stay', 'farm-stay', 'Green Valley Farm Stay', 'إقامة مزرعة الوادي الأخضر', 'A serene farm stay in a lush green valley with organic produce and nature activities.', 'إقامة هادئة في مزرعة بوادٍ أخضر خصيب مع منتجات عضوية وأنشطة طبيعية.', 'Hatta, Dubai', 'حتا، دبي', 2, 2, 5, FALSE, TRUE, 'AED 480/night', '["WiFi","Organic Farm","Hiking","Kitchen","Breakfast"]', '["/airo-assets/images/properties/green-valley-farm-stay"]', FALSE, TRUE),
        ('masfout-mountain-chalet', 'chalet', 'Masfout Mountain Chalet', 'شاليه مصفوت الجبلي', 'A secluded mountain chalet near Masfout with a private pool and stunning valley views.', 'شاليه جبلي منعزل قرب مصفوت مع حمام سباحة خاص وإطلالات رائعة على الوادي.', 'Masfout, Ajman', 'مصفوت، عجمان', 3, 2, 6, TRUE, FALSE, 'AED 750/night', '["WiFi","Private Pool","BBQ","Mountain View"]', '["/airo-assets/images/properties/masfout-mountain-chalet"]', FALSE, TRUE)
      `);
      console.log('migrations: seeded 8 properties');
    }

    console.log('migrations: properties table ready');
  } catch (err) {
    console.error('migrations: error:', String(err));
  }
}
