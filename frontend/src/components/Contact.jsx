import React, { useState } from 'react';
import { companyInfo } from '../mockData';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { MapPin, Phone, Mail, Send, HelpCircle, X, ChevronDown } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// FAQ content — edit these questions/answers anytime
const FAQS = [
  {
    question: "What is the best time to visit Varanasi?",
    answer: "The ideal time to visit Varanasi is between October and March, when the weather is pleasant and comfortable — perfect for ghat walks, sunrise boat rides, and the evening Ganga Aarti. The summer months (April to June) can be very hot, so early mornings and evenings are best if you travel then."
  },
  {
    question: "Is there a dress code for visiting temples in Kashi or Ayodhya?",
    answer: "There is no strict dress code, but modest clothing that covers the shoulders and knees is respectful and recommended. You will be asked to remove your footwear before entering, and a few temples do not permit phones or cameras inside. We're happy to advise you before each visit."
  },
  {
    question: "Do you provide airport and railway station transfers?",
    answer: "Yes. We offer reliable, on-time pickups and drops from both the airport and railway station in clean, comfortable AC vehicles. You can book a transfer on its own or add it to any tour package for a completely hassle-free arrival."
  },
  {
    question: "Are 2 days enough to explore Kashi?",
    answer: "Two days are enough to enjoy the highlights — Kashi Vishwanath darshan, the main ghats, a boat ride on the Ganga, and the evening Ganga Aarti. If you'd like to explore more deeply, including Sarnath, Ramnagar Fort, and additional temples, we recommend our 3 Nights / 4 Days package."
  },
  {
    question: "Where can I attend the Ganga Aarti?",
    answer: "The most famous Ganga Aarti takes place every evening at Dashashwamedh Ghat, beginning shortly after sunset — around 6 PM in winter and 7 PM in summer. You can watch from the ghat steps, but the most memorable view is from a boat on the river, which we can arrange for you."
  },
  {
    question: "How can I book a tour package?",
    answer: "Booking is simple. Browse our packages and send us an enquiry, or reach out directly by phone, WhatsApp, or the contact form above. We'll confirm availability, share a detailed itinerary, and guide you through every step until your trip is confirmed."
  },
  {
    question: "Do you provide local guides?",
    answer: "Yes. We provide experienced, trusted local Banarasi guides, including specialists for food walks, ghat walks, and temple walks. Multilingual guides are available in English, Marathi, Kannada, and Tamil, so you can explore comfortably in your preferred language."
  },
  {
    question: "Can I customize my itinerary?",
    answer: "Absolutely. Every package is fully flexible and can be tailored to your stay preference, vehicle type, group size, and number of days. Just share what you have in mind, and we'll design a journey that suits you perfectly."
  },
  {
    question: "Which are the must-visit temples in Varanasi?",
    answer: "The essential temples are Kashi Vishwanath, Kaal Bhairav, Annapurna, Sankat Mochan, and Durga Temple (Durgakund). Just outside the city, Sarnath is also a must-visit for its peaceful Buddhist heritage and historic Dhamek Stupa."
  },
  {
    question: "What is included in the sightseeing tour?",
    answer: "Our sightseeing tours include a private AC vehicle and a knowledgeable local guide, covering the major temples, ghats, and heritage sites with a flexible, unhurried itinerary. Temple entry tickets and personal expenses are additional unless clearly mentioned in your package."
  }
];

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // FAQ popup state
  const [showFaq, setShowFaq] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    try {
      const response = await fetch(`${API}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit contact form');
      }

      toast({
        title: "Message Sent!",
        description: "We'll get back to you within 24 hours.",
      });

      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Contact form error:', error);
      toast({
        title: "Submission Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
            Get In Touch
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contact Us
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Let's Connect
              </h3>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Whether you're planning your spiritual journey or have questions about our packages,
                our team is here to help you create an unforgettable Varanasi experience.
              </p>

              {/* FAQ Button */}
              <Button
                onClick={() => setShowFaq(true)}
                variant="outline"
                className="border-2 border-orange-300 text-orange-700 hover:bg-orange-50 hover:border-orange-400 font-semibold"
              >
                <HelpCircle className="mr-2" size={20} />
                View FAQs
              </Button>
            </div>

            {/* Contact Cards */}
            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start space-x-4 p-6 bg-orange-50 rounded-xl border-2 border-orange-100 hover:border-orange-300 transition-colors duration-200">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                  <MapPin className="text-white" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Our Location</h4>
                  <p className="text-gray-700">{companyInfo.address}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-4 p-6 bg-orange-50 rounded-xl border-2 border-orange-100 hover:border-orange-300 transition-colors duration-200">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                  <Phone className="text-white" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                  <p className="text-gray-700">{companyInfo.phone}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-4 p-6 bg-orange-50 rounded-xl border-2 border-orange-100 hover:border-orange-300 transition-colors duration-200">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                  <Mail className="text-white" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                  <p className="text-gray-700">{companyInfo.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-8 rounded-2xl border-2 border-orange-100 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="contact-name" className="text-gray-900">Name *</Label>
                <Input
                  id="contact-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  required
                  className="bg-white border-orange-200 focus:border-orange-400"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="contact-email" className="text-gray-900">Email *</Label>
                <Input
                  id="contact-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  required
                  className="bg-white border-orange-200 focus:border-orange-400"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="contact-phone" className="text-gray-900">Phone *</Label>
                <Input
                  id="contact-phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 XXXXX XXXXX"
                  required
                  className="bg-white border-orange-200 focus:border-orange-400"
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="contact-message" className="text-gray-900">Message *</Label>
                <Textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us about your travel plans or any questions..."
                  rows={5}
                  required
                  className="bg-white border-orange-200 focus:border-orange-400"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-6 text-lg font-semibold"
              >
                {submitting ? (
                  'Sending...'
                ) : (
                  <>
                    <Send className="mr-2" size={20} />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* ==================== FAQ POPUP ==================== */}
      {showFaq && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setShowFaq(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Popup Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50">
              <h3 className="text-2xl font-bold text-gray-900">
                Frequently Asked Questions
              </h3>
              <button
                onClick={() => setShowFaq(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:bg-orange-100 hover:text-orange-700 transition-colors"
                aria-label="Close"
              >
                <X size={22} />
              </button>
            </div>

            {/* Popup Body — accordion */}
            <div className="overflow-y-auto p-4 space-y-3">
              {FAQS.map((faq, i) => (
                <div
                  key={i}
                  className="border-2 border-orange-100 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between text-left px-5 py-4 font-semibold text-gray-900 hover:bg-orange-50 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      size={20}
                      className={`flex-shrink-0 ml-3 text-orange-600 transition-transform duration-200 ${
                        openFaq === i ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-4 text-gray-700 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Contact;
