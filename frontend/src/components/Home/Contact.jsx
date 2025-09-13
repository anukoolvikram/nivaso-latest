import { useState } from 'react';

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/contact/contact`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        }
      );
      if (!res.ok) throw new Error();
      alert('Message sent!');
      setForm({ name:'', email:'', subject:'', message:'' });
    } catch {
      alert('Failed to send. Try again later.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="relative min-h-screen py-10">
      <div className="absolute inset-0 bg-black opacity-80 z-0" />
      <div className="relative z-5 flex flex-col md:flex-row text-white p-4 md:p-10">
        <div className="w-full md:w-2/3 px-0 md:px-10 mb-10 md:mb-0">
          <div className="w-full font-cormorant text-3xl md:text-4xl mb-6 md:mb-10">
            Get in touch!
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 md:gap-10 font-barlow text-lg"
          >
            <div className="flex flex-col md:flex-row md:space-x-8 space-y-6 md:space-y-0">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                type="text"
                placeholder="Full Name"
                className="w-full md:w-1/2 border-b p-2 bg-transparent"
                required
              />
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                placeholder="E-Mail"
                className="w-full md:w-1/2 border-b p-2 bg-transparent"
                required
              />
            </div>
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              type="text"
              placeholder="Subject"
              className="w-full border-b p-2 bg-transparent"
              required
            />
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              placeholder="Your message..."
              className="w-full border p-2 bg-transparent"
              required
            />
            <div>
              <button
                type="submit"
                disabled={sending}
                className="bg-white text-black px-6 py-2 hover:cursor-pointer disabled:opacity-50"
              >
                {sending ? 'Sending…' : 'Send'}
              </button>
            </div>
          </form>
        </div>

        <div className="hidden md:block mt-15 bg-tan w-2 h-64 mx-10"></div>

        <div className="mt-10 md:mt-15 px-0 md:px-10 h-full flex flex-col text-gray-200 text-sm md:text-lg justify-start md:justify-around gap-6 md:gap-10">
          <div className="underline">nivaso@gmail.com</div>
          <div>+91 8080104085</div>
          <div>
            <div>Rahul Bajaj Technology</div>
            <div>Innovation Center</div>
            <div>SINE IIT Bombay</div>
            <div>Powai, Mumbai - 400076</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;