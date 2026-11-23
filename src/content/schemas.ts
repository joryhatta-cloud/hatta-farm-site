import { z } from 'zod';
export const schemas = {
  pages: {
    home: z.object({
      "hero": z.object({
        "headlineEn": z.string(),
        "headlineAr": z.string(),
        "subheadlineEn": z.string(),
        "subheadlineAr": z.string(),
        "ctaPrimaryEn": z.string(),
        "ctaPrimaryAr": z.string(),
        "ctaSecondaryEn": z.string(),
        "ctaSecondaryAr": z.string()
      }),
      "categories": z.array(z.object({
        "id": z.string(),
        "nameEn": z.string(),
        "nameAr": z.string(),
        "taglineEn": z.string(),
        "taglineAr": z.string(),
        "href": z.string(),
        "size": z.string()
      })),
      "featuredProperties": z.array(z.object({
        "id": z.string(),
        "nameEn": z.string(),
        "nameAr": z.string(),
        "locationEn": z.string(),
        "locationAr": z.string(),
        "type": z.string(),
        "bedrooms": z.number(),
        "bathrooms": z.number(),
        "guests": z.number(),
        "hasPool": z.boolean(),
        "priceFrom": z.number(),
        "descriptionEn": z.string()
      })),
      "events": z.object({
        "headlineEn": z.string(),
        "headlineAr": z.string(),
        "subheadlineEn": z.string(),
        "subheadlineAr": z.string(),
        "types": z.array(z.object({
          "id": z.string(),
          "en": z.string(),
          "ar": z.string()
        })),
        "ctaEn": z.string(),
        "ctaAr": z.string()
      }),
      "services": z.array(z.object({
        "id": z.string(),
        "en": z.string(),
        "ar": z.string()
      })),
      "guide": z.object({
        "headlineEn": z.string(),
        "headlineAr": z.string(),
        "subheadlineEn": z.string(),
        "subheadlineAr": z.string(),
        "ctaEn": z.string(),
        "ctaAr": z.string(),
        "categories": z.array(z.object({
          "id": z.string(),
          "en": z.string(),
          "ar": z.string(),
          "icon": z.string()
        }))
      })
    }),
    services: z.object({
      "hero": z.object({
        "titleEn": z.string(),
        "titleAr": z.string(),
        "subtitleEn": z.string(),
        "subtitleAr": z.string()
      }),
      "services": z.array(z.object({
        "id": z.string(),
        "icon": z.string(),
        "titleEn": z.string(),
        "titleAr": z.string(),
        "descriptionEn": z.string(),
        "descriptionAr": z.string(),
        "features": z.array(z.object({
          "id": z.string(),
          "en": z.string(),
          "ar": z.string()
        }))
      })),
      "cta": z.object({
        "titleEn": z.string(),
        "titleAr": z.string(),
        "subtitleEn": z.string(),
        "subtitleAr": z.string(),
        "buttonEn": z.string(),
        "buttonAr": z.string()
      })
    }),
    hatta_guide: z.object({
      "hero": z.object({
        "titleEn": z.string(),
        "titleAr": z.string(),
        "subtitleEn": z.string(),
        "subtitleAr": z.string()
      }),
      "categories": z.array(z.object({
        "id": z.string(),
        "en": z.string(),
        "ar": z.string(),
        "icon": z.string()
      })),
      "places": z.array(z.object({
        "id": z.string(),
        "category": z.string(),
        "nameEn": z.string(),
        "nameAr": z.string(),
        "descriptionEn": z.string(),
        "descriptionAr": z.string(),
        "locationEn": z.string(),
        "locationAr": z.string(),
        "phone": z.string(),
        "mapsUrl": z.string(),
        "tags": z.array(z.string())
      }))
    }),
    category: z.object({
      "cta": z.object({
        "titleEn": z.string(),
        "titleAr": z.string(),
        "buttonEn": z.string(),
        "buttonAr": z.string()
      }),
      "filters": z.object({
        "searchPlaceholder": z.string(),
        "anyGuests": z.string(),
        "noResults": z.string(),
        "noResultsAr": z.string()
      })
    }),
    property_detail: z.object({
      "labels": z.object({
        "aboutEn": z.string(),
        "amenitiesEn": z.string(),
        "locationEn": z.string(),
        "startingFrom": z.string(),
        "bookWhatsApp": z.string(),
        "bookWhatsAppAr": z.string(),
        "callEnquire": z.string(),
        "openMaps": z.string(),
        "tabbyEn": z.string(),
        "tabbyAr": z.string(),
        "bedroomsLabel": z.string(),
        "bathroomsLabel": z.string(),
        "maxGuestsLabel": z.string(),
        "ratingLabel": z.string(),
        "poolLabel": z.string(),
        "breakfastLabel": z.string(),
        "bbqLabel": z.string(),
        "notFoundTitle": z.string(),
        "notFoundDesc": z.string(),
        "backHome": z.string()
      })
    }),
    admin_login: z.object({
      "title": z.string(),
      "subtitle": z.string(),
      "brandName": z.string(),
      "emailLabel": z.string(),
      "emailPlaceholder": z.string(),
      "passwordLabel": z.string(),
      "submitBtn": z.string(),
      "loadingBtn": z.string(),
      "errorMsg": z.string(),
      "errorGeneric": z.string()
    }),
    admin_dashboard: z.object({
      "title": z.string(),
      "welcome": z.string(),
      "statsTitle": z.string(),
      "totalProps": z.string(),
      "activeProps": z.string(),
      "featuredProps": z.string(),
      "manageProps": z.string(),
      "managePropsDesc": z.string(),
      "goToProps": z.string(),
      "logoutBtn": z.string(),
      "categories": z.object({
        "resort": z.string(),
        "chalet": z.string(),
        "farm-stay": z.string(),
        "holiday-home": z.string(),
        "room": z.string(),
        "event-stay": z.string()
      })
    }),
    admin_properties: z.object({
      "title": z.string(),
      "addBtn": z.string(),
      "searchPlaceholder": z.string(),
      "allCategories": z.string(),
      "editBtn": z.string(),
      "deleteBtn": z.string(),
      "deleteConfirm": z.string(),
      "activeLabel": z.string(),
      "inactiveLabel": z.string(),
      "featuredLabel": z.string(),
      "bedroomsLabel": z.string(),
      "guestsLabel": z.string(),
      "noResults": z.string(),
      "saveBtn": z.string(),
      "cancelBtn": z.string(),
      "addTitle": z.string(),
      "editTitle": z.string(),
      "fields": z.object({
        "nameEn": z.string(),
        "nameAr": z.string(),
        "slug": z.string(),
        "category": z.string(),
        "descEn": z.string(),
        "descAr": z.string(),
        "locationEn": z.string(),
        "locationAr": z.string(),
        "mapsUrl": z.string(),
        "bedrooms": z.string(),
        "bathrooms": z.string(),
        "maxGuests": z.string(),
        "pricePerNight": z.string(),
        "whatsapp": z.string(),
        "hasPool": z.string(),
        "hasBreakfast": z.string(),
        "hasKitchen": z.string(),
        "hasBbq": z.string(),
        "hasHousekeeping": z.string(),
        "featured": z.string(),
        "active": z.string()
      })
    }),
    admin_setup: z.object({
      "title": z.string(),
      "subtitle": z.string(),
      "nameLabel": z.string(),
      "emailLabel": z.string(),
      "passwordLabel": z.string(),
      "submitBtn": z.string(),
      "loadingBtn": z.string(),
      "successMsg": z.string(),
      "goToLogin": z.string(),
      "alreadySetup": z.string()
    }),
    admin_analytics: z.object({
      "title": z.string(),
      "totalViews": z.string(),
      "uniqueSessions": z.string(),
      "topPages": z.string(),
      "topReferrers": z.string(),
      "dailyViews": z.string(),
      "last7days": z.string(),
      "last30days": z.string(),
      "last90days": z.string(),
      "noData": z.string(),
      "views": z.string(),
      "backToDashboard": z.string()
    }),
    contact: z.object({
      "hero": z.object({
        "title": z.string(),
        "titleEn": z.string(),
        "subtitle": z.string()
      }),
      "tabs": z.object({
        "inquiry": z.string(),
        "booking": z.string(),
        "delivery": z.string(),
        "transfer": z.string()
      }),
      "fields": z.object({
        "name": z.string(),
        "email": z.string(),
        "phone": z.string(),
        "message": z.string(),
        "submit": z.string(),
        "sending": z.string(),
        "success": z.string(),
        "error": z.string()
      }),
      "booking": z.object({
        "propertyName": z.string(),
        "checkIn": z.string(),
        "checkOut": z.string(),
        "guests": z.string(),
        "specialRequests": z.string()
      }),
      "delivery": z.object({
        "items": z.string(),
        "deliveryDate": z.string(),
        "deliveryAddress": z.string(),
        "notes": z.string()
      }),
      "transfer": z.object({
        "flightNumber": z.string(),
        "arrivalDate": z.string(),
        "arrivalTime": z.string(),
        "passengers": z.string(),
        "luggage": z.string(),
        "destination": z.string(),
        "notes": z.string()
      }),
      "contact": z.object({
        "title": z.string(),
        "phone": z.string(),
        "whatsapp": z.string(),
        "email": z.string(),
        "location": z.string(),
        "hours": z.string()
      })
    })
  }
};
export type Schemas = typeof schemas;