import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Feedback() {
  const navigate = useNavigate();
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  
  useEffect(() => {
    // Check if user just placed an order
    const orderPlaced = localStorage.getItem('orderPlaced');
    if (orderPlaced === 'true') {
      setShowOrderConfirmation(true);
      localStorage.removeItem('orderPlaced');
    }
  }, []);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'General'
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Feedback submitted:', { ...feedback, rating });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFeedback({ name: '', email: '', subject: '', message: '', category: 'General' });
      setRating(0);
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Order Confirmation Banner */}
      {showOrderConfirmation && (
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-3xl p-8 mb-8 text-white shadow-xl">
          <div className="flex items-center justify-center mb-4">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-3 text-center">🎉 Thank You for Your Order!</h1>
          <p className="text-white text-opacity-90 text-center text-lg mb-6">
            Your order has been placed successfully and is being processed.
          </p>
          <div className="flex justify-center">
            <Link 
              to="/orders" 
              className="btn bg-white text-green-600 hover:bg-gray-100 inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Track Your Order
            </Link>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-accent-600 to-primary-600 rounded-3xl p-8 mb-8 text-white shadow-xl">
        <h1 className="text-4xl font-bold mb-2">💬 We Value Your Feedback</h1>
        <p className="text-white text-opacity-90">{showOrderConfirmation ? 'Share your shopping experience with us' : 'Help us serve you better by sharing your experience'}</p>
      </div>

      {submitted ? (
        <div className="card text-center py-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full mb-6">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold gradient-text mb-3">Thank You!</h2>
          <p className="text-gray-600 text-lg mb-6">Your feedback has been submitted successfully.</p>
          {showOrderConfirmation && (
            <Link 
              to="/orders" 
              className="btn btn-primary inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Go to Order Tracking
            </Link>
          )}
        </div>
      ) : (
        <div className="card">
          <form onSubmit={handleSubmit}>
            {/* Rating */}
            <div className="mb-8 text-center pb-8 border-b-2 border-gray-100">
              <label className="block text-xl font-bold text-gray-800 mb-4">How would you rate your experience?</label>
              <div className="flex justify-center gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                    className="transition-transform duration-200 hover:scale-125"
                  >
                    <svg
                      className={`w-12 h-12 ${
                        star <= (hoveredRating || rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        fill={star <= (hoveredRating || rating) ? 'currentColor' : 'none'}
                      />
                    </svg>
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-gray-600 mt-3 text-lg">
                  {rating === 1 && '😞 Poor'}
                  {rating === 2 && '😐 Fair'}
                  {rating === 3 && '🙂 Good'}
                  {rating === 4 && '😊 Very Good'}
                  {rating === 5 && '🌟 Excellent'}
                </p>
              )}
            </div>

            {/* Form Fields */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Full Name *</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter your name"
                  value={feedback.name}
                  onChange={(e) => setFeedback({ ...feedback, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Email Address *</label>
                <input
                  type="email"
                  className="input"
                  placeholder="your.email@example.com"
                  value={feedback.email}
                  onChange={(e) => setFeedback({ ...feedback, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Category *</label>
                <select
                  className="input"
                  value={feedback.category}
                  onChange={(e) => setFeedback({ ...feedback, category: e.target.value })}
                  required
                >
                  <option value="General">General Feedback</option>
                  <option value="Service">Service Quality</option>
                  <option value="Products">Product Availability</option>
                  <option value="Website">Website Experience</option>
                  <option value="Delivery">Delivery & Shipping</option>
                  <option value="Complaint">Complaint</option>
                  <option value="Suggestion">Suggestion</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Subject *</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Brief subject of your feedback"
                  value={feedback.subject}
                  onChange={(e) => setFeedback({ ...feedback, subject: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Your Message *</label>
              <textarea
                className="input min-h-32"
                placeholder="Share your detailed feedback, suggestions, or concerns..."
                value={feedback.message}
                onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
                required
                rows="6"
              ></textarea>
            </div>

            <div className="flex gap-4">
              <button type="submit" className="btn btn-primary flex-1">
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Submit Feedback
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setFeedback({ name: '', email: '', subject: '', message: '', category: 'General' });
                  setRating(0);
                }}
                className="btn btn-outline"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FAQ Section */}
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <div className="card border-2 border-primary-200 hover:border-primary-400 transition-colors">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Email Us</h3>
          <p className="text-gray-600 text-sm">support@medimitra.com</p>
        </div>

        <div className="card border-2 border-secondary-200 hover:border-secondary-400 transition-colors">
          <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Call Us</h3>
          <p className="text-gray-600 text-sm">+91-1800-123-4567</p>
        </div>

        <div className="card border-2 border-accent-200 hover:border-accent-400 transition-colors">
          <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">Support Hours</h3>
          <p className="text-gray-600 text-sm">24/7 Available</p>
        </div>
      </div>
    </div>
  );
}

export default Feedback;
