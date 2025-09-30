// app/components/ContactSection.tsx
export default function ContactSection() {
  return (
    <section id="contact" className="px-6 py-12 bg-gray-100">
      <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
      <form className="max-w-lg flex flex-col gap-4">
        <input
          type="text"
          placeholder="Your Name"
          className="p-3 border rounded-lg"
        />
        <input
          type="email"
          placeholder="Your Email"
          className="p-3 border rounded-lg"
        />
        <textarea
          placeholder="Your Message"
          rows={4}
          className="p-3 border rounded-lg"
        />
        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition"
        >
          Send
        </button>
      </form>
    </section>
  );
}
