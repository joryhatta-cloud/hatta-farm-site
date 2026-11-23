import { useState, type FormEvent } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { motion } from 'motion/react';
import {
  Phone, Mail, MapPin, Clock, MessageCircle,
  Send, CheckCircle, AlertCircle
} from 'lucide-react';
import { contact as t } from 'virtual:content';
import { useLang } from '@/lib/lang-context';

type FormStatus = 'idle' | 'sending' | 'success' | 'error';
type TabId = 'inquiry' | 'booking' | 'delivery' | 'transfer';

const inputClass =
  'w-full px-4 py-3 rounded-xl border border-[hsl(var(--border))] bg-white text-sm ' +
  'text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] ' +
  'focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/30 ' +
  'focus:border-[hsl(var(--primary))]/50 transition-all';

const labelClass = 'block text-sm font-medium text-[hsl(var(--foreground))] mb-1.5';

function FormFooter({ status, errorMsg }: { status: FormStatus; errorMsg: string }) {
  return (
    <div className="pt-2 space-y-4">
      {status === 'error' && (
        <div role="alert" className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      {status === 'success' ? (
        <div role="status" className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-4 py-4 rounded-xl">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span className="font-medium">{t.fields.success}</span>
        </div>
      ) : (
        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full flex items-center justify-center gap-2 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-white font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-60"
        >
          <Send className="w-4 h-4" />
          {status === 'sending' ? t.fields.sending : t.fields.submit}
        </button>
      )}
    </div>
  );
}

function InquiryForm() {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (fd.get('_gotcha')) return;
    const name = String(fd.get('name') ?? '').trim();
    const email = String(fd.get('email') ?? '').trim();
    const phone = String(fd.get('phone') ?? '').trim();
    const message = String(fd.get('message') ?? '').trim();
    setStatus('sending'); setErrorMsg('');
    try {
      const res = await fetch('/api/contact/general-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation: {
            messages_attributes: [{ body: message || 'New contact form submission' }],
            data: { __gd_contact_form_title: 'استفسار عام — Hatta Farm', 'رقم الهاتف': phone },
          },
          user: { email, name },
        }),
      });
      const json = await res.json() as { success: boolean; error?: string };
      if (json.success) { setStatus('success'); form.reset(); }
      else throw new Error(json.error ?? 'Something went wrong.');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : t.fields.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div><label className={labelClass}>{t.fields.name} *</label><input name="name" required className={inputClass} placeholder="محمد أحمد" /></div>
      </div>
      <div><label className={labelClass}>{t.fields.phone}</label><input name="phone" type="tel" className={inputClass} placeholder="+971 50 000 0000" /></div>
      <div><label className={labelClass}>{t.fields.message} *</label><textarea name="message" required rows={5} className={inputClass} placeholder="كيف يمكننا مساعدتك؟" /></div>
      <FormFooter status={status} errorMsg={errorMsg} />
    </form>
  );
}

function BookingForm() {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (fd.get('_gotcha')) return;
    const name = String(fd.get('name') ?? '').trim();
    const email = String(fd.get('email') ?? '').trim();
    const phone = String(fd.get('phone') ?? '').trim();
    const property = String(fd.get('property') ?? '').trim();
    const checkIn = String(fd.get('checkIn') ?? '');
    const checkOut = String(fd.get('checkOut') ?? '');
    const guests = String(fd.get('guests') ?? '');
    const requests = String(fd.get('requests') ?? '').trim();
    setStatus('sending'); setErrorMsg('');
    try {
      const res = await fetch('/api/contact/booking-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation: {
            messages_attributes: [{ body: requests || 'New booking request' }],
            data: {
              __gd_contact_form_title: 'طلب حجز — Hatta Farm',
              'العقار / الفئة': property,
              'تاريخ الوصول': checkIn,
              'تاريخ المغادرة': checkOut,
              'عدد الضيوف': guests,
              'رقم الهاتف': phone,
            },
          },
          user: { email, name },
        }),
      });
      const json = await res.json() as { success: boolean; error?: string };
      if (json.success) { setStatus('success'); form.reset(); }
      else throw new Error(json.error ?? 'Something went wrong.');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : t.fields.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div><label className={labelClass}>{t.fields.name} *</label><input name="name" required className={inputClass} placeholder="محمد أحمد" /></div>
        <div><label className={labelClass}>{t.fields.email} *</label><input name="email" type="email" required className={inputClass} placeholder="example@email.com" /></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div><label className={labelClass}>{t.fields.phone}</label><input name="phone" type="tel" className={inputClass} placeholder="+971 50 000 0000" /></div>
        <div><label className={labelClass}>{t.booking.propertyName}</label><input name="property" className={inputClass} placeholder="مثال: شاليه الحجر" /></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div><label className={labelClass}>{t.booking.checkIn} *</label><input name="checkIn" type="date" required className={inputClass} /></div>
        <div><label className={labelClass}>{t.booking.checkOut} *</label><input name="checkOut" type="date" required className={inputClass} /></div>
      </div>
      <div>
        <label className={labelClass}>{t.booking.guests}</label>
        <select name="guests" className={inputClass}>
          {['1','2','3','4','5','6','7','8+'].map(n => (
            <option key={n} value={n}>{n} {n === '1' ? 'ضيف' : 'ضيوف'}</option>
          ))}
        </select>
      </div>
      <div><label className={labelClass}>{t.booking.specialRequests}</label><textarea name="requests" rows={4} className={inputClass} placeholder="أي طلبات خاصة أو ملاحظات..." /></div>
      <FormFooter status={status} errorMsg={errorMsg} />
    </form>
  );
}

function DeliveryForm() {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (fd.get('_gotcha')) return;
    const name = String(fd.get('name') ?? '').trim();
    const email = String(fd.get('email') ?? '').trim();
    const phone = String(fd.get('phone') ?? '').trim();
    const items = String(fd.get('items') ?? '').trim();
    const deliveryDate = String(fd.get('deliveryDate') ?? '');
    const address = String(fd.get('address') ?? '').trim();
    const notes = String(fd.get('notes') ?? '').trim();
    setStatus('sending'); setErrorMsg('');
    try {
      const res = await fetch('/api/contact/delivery-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation: {
            messages_attributes: [{ body: items || 'New delivery request' }],
            data: {
              __gd_contact_form_title: 'طلب توصيل — Hatta Farm',
              'تاريخ التوصيل': deliveryDate,
              'عنوان التوصيل': address,
              'رقم الهاتف': phone,
              'ملاحظات': notes,
            },
          },
          user: { email, name },
        }),
      });
      const json = await res.json() as { success: boolean; error?: string };
      if (json.success) { setStatus('success'); form.reset(); }
      else throw new Error(json.error ?? 'Something went wrong.');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : t.fields.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div><label className={labelClass}>{t.fields.name} *</label><input name="name" required className={inputClass} placeholder="محمد أحمد" /></div>
        <div><label className={labelClass}>{t.fields.email} *</label><input name="email" type="email" required className={inputClass} placeholder="example@email.com" /></div>
      </div>
      <div><label className={labelClass}>{t.fields.phone} *</label><input name="phone" type="tel" required className={inputClass} placeholder="+971 50 000 0000" /></div>
      <div><label className={labelClass}>{t.delivery.items} *</label><textarea name="items" required rows={4} className={inputClass} placeholder="مثال: تمر، عسل، منتجات مزرعة..." /></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div><label className={labelClass}>{t.delivery.deliveryDate}</label><input name="deliveryDate" type="date" className={inputClass} /></div>
        <div><label className={labelClass}>{t.delivery.deliveryAddress}</label><input name="address" className={inputClass} placeholder="دبي، أبوظبي..." /></div>
      </div>
      <div><label className={labelClass}>{t.delivery.notes}</label><textarea name="notes" rows={3} className={inputClass} placeholder="أي تعليمات إضافية..." /></div>
      <FormFooter status={status} errorMsg={errorMsg} />
    </form>
  );
}

function TransferForm() {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (fd.get('_gotcha')) return;
    const name = String(fd.get('name') ?? '').trim();
    const email = String(fd.get('email') ?? '').trim();
    const phone = String(fd.get('phone') ?? '').trim();
    const flight = String(fd.get('flight') ?? '').trim();
    const arrivalDate = String(fd.get('arrivalDate') ?? '');
    const arrivalTime = String(fd.get('arrivalTime') ?? '');
    const passengers = String(fd.get('passengers') ?? '');
    const luggage = String(fd.get('luggage') ?? '');
    const destination = String(fd.get('destination') ?? '').trim();
    const notes = String(fd.get('notes') ?? '').trim();
    setStatus('sending'); setErrorMsg('');
    try {
      const res = await fetch('/api/contact/airport-transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation: {
            messages_attributes: [{ body: notes || 'New airport transfer request' }],
            data: {
              __gd_contact_form_title: 'نقل من المطار — Hatta Farm',
              'رقم الرحلة': flight,
              'تاريخ الوصول': arrivalDate,
              'وقت الوصول': arrivalTime,
              'عدد الركاب': passengers,
              'عدد الحقائب': luggage,
              'الوجهة': destination,
              'رقم الهاتف': phone,
            },
          },
          user: { email, name },
        }),
      });
      const json = await res.json() as { success: boolean; error?: string };
      if (json.success) { setStatus('success'); form.reset(); }
      else throw new Error(json.error ?? 'Something went wrong.');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : t.fields.error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div><label className={labelClass}>{t.fields.name} *</label><input name="name" required className={inputClass} placeholder="محمد أحمد" /></div>
        <div><label className={labelClass}>{t.fields.email} *</label><input name="email" type="email" required className={inputClass} placeholder="example@email.com" /></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div><label className={labelClass}>{t.fields.phone} *</label><input name="phone" type="tel" required className={inputClass} placeholder="+971 50 000 0000" /></div>
        <div><label className={labelClass}>{t.transfer.flightNumber}</label><input name="flight" className={inputClass} placeholder="EK 123" /></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div><label className={labelClass}>{t.transfer.arrivalDate} *</label><input name="arrivalDate" type="date" required className={inputClass} /></div>
        <div><label className={labelClass}>{t.transfer.arrivalTime} *</label><input name="arrivalTime" type="time" required className={inputClass} /></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>{t.transfer.passengers}</label>
          <select name="passengers" className={inputClass}>
            {['1','2','3','4','5','6','7','8+'].map(n => (
              <option key={n} value={n}>{n} {n === '1' ? 'راكب' : 'ركاب'}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>{t.transfer.luggage}</label>
          <select name="luggage" className={inputClass}>
            {['0','1','2','3','4','5+'].map(n => (
              <option key={n} value={n}>{n} {n === '1' ? 'حقيبة' : 'حقائب'}</option>
            ))}
          </select>
        </div>
      </div>
      <div><label className={labelClass}>{t.transfer.destination}</label><input name="destination" className={inputClass} placeholder="مثال: منتجع حتا هيلز" /></div>
      <div><label className={labelClass}>{t.transfer.notes}</label><textarea name="notes" rows={3} className={inputClass} placeholder="أي ملاحظات إضافية..." /></div>
      <FormFooter status={status} errorMsg={errorMsg} />
    </form>
  );
}

const TABS: { id: TabId; icon: string }[] = [
  { id: 'inquiry',  icon: '💬' },
  { id: 'booking',  icon: '🏡' },
  { id: 'delivery', icon: '📦' },
  { id: 'transfer', icon: '✈️' },
];

const FORM_MAP: Record<TabId, () => React.JSX.Element> = {
  inquiry:  InquiryForm,
  booking:  BookingForm,
  delivery: DeliveryForm,
  transfer: TransferForm,
};

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState<TabId>('inquiry');
  const { lang } = useLang();
  const ActiveForm = FORM_MAP[activeTab];

  const tabLabels: Record<TabId, string> = {
    inquiry:  t.tabs.inquiry,
    booking:  t.tabs.booking,
    delivery: t.tabs.delivery,
    transfer: t.tabs.transfer,
  };

  return (
    <>
      <Helmet>
        <title>تواصل معنا — Hatta Farm</title>
        <meta name="description" content="تواصل مع فريق Hatta Farm لاستفساراتك وطلبات الحجز والتوصيل ونقل المطار." />
        <meta property="og:title" content="تواصل معنا — Hatta Farm" />
        <meta property="og:description" content="نحن هنا لمساعدتك في تخطيط إقامتك المثالية في حتا." />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Hero */}
      <section className="relative bg-[hsl(var(--primary))] py-20 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, hsl(var(--accent)) 0%, transparent 60%)' }}
        />
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-[hsl(var(--accent))] text-sm font-medium tracking-wide mb-3"
          >
            {t.hero.titleEn}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-light text-white mb-4"
            style={{ fontFamily: lang === 'ar' ? "'Amiri', serif" : "'Cormorant Garamond', serif" }}
          >
            {lang === 'ar' ? t.hero.title : t.hero.titleEn}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/70 text-lg max-w-xl mx-auto"
          >
            {t.hero.subtitle}
          </motion.p>
        </div>
      </section>

      <main>
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Contact info sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-[hsl(var(--primary))] rounded-2xl p-7 text-white">
                <h2 className="text-xl font-semibold mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {t.contact.title}
                </h2>
                <div className="space-y-5">
                  <a href={`tel:${t.contact.phone}`} className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-[hsl(var(--accent))]/30 transition-colors">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-white/60 text-xs mb-0.5">هاتف</p>
                      <p className="font-medium" dir="ltr">{t.contact.phone}</p>
                    </div>
                  </a>
                  <a
                    href={`https://wa.me/971${t.contact.phone.replace(/^0/, '')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-[hsl(var(--whatsapp))]/30 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-white/60 text-xs mb-0.5">{t.contact.whatsapp}</p>
                      <p className="font-medium" dir="ltr">{t.contact.phone}</p>
                    </div>
                  </a>
                  <a href={`mailto:${t.contact.email}`} className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-[hsl(var(--accent))]/30 transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-white/60 text-xs mb-0.5">بريد إلكتروني</p>
                      <p className="font-medium text-sm" dir="ltr">{t.contact.email}</p>
                    </div>
                  </a>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-white/60 text-xs mb-0.5">الموقع</p>
                      <p className="font-medium text-sm">{t.contact.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-white/60 text-xs mb-0.5">ساعات العمل</p>
                      <p className="font-medium text-sm">{t.contact.hours}</p>
                    </div>
                  </div>
                </div>
              </div>

              <a
                href={`https://wa.me/971${t.contact.phone.replace(/^0/, '')}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full bg-[hsl(var(--whatsapp))] hover:bg-[hsl(var(--whatsapp-hover))] text-white font-semibold py-4 rounded-2xl transition-colors shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
                تواصل عبر واتساب
              </a>
            </motion.aside>

            {/* Tabbed forms */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-2"
            >
              <div className="flex gap-2 mb-8 overflow-x-auto pb-1" role="tablist" aria-label="نوع الطلب">
                {TABS.map(tb => (
                  <button
                    key={tb.id}
                    role="tab"
                    aria-selected={activeTab === tb.id}
                    onClick={() => setActiveTab(tb.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                      activeTab === tb.id
                        ? 'bg-[hsl(var(--primary))] text-white shadow-md'
                        : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--border))]'
                    }`}
                  >
                    <span>{tb.icon}</span>
                    <span>{tabLabels[tb.id]}</span>
                  </button>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-[hsl(var(--border))] p-8 shadow-sm">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ActiveForm />
                </motion.div>
              </div>
            </motion.div>

          </div>
        </section>
      </main>
    </>
  );
}
