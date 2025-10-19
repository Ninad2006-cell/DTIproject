import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// AnimalWelfareApp.jsx
// Single-file React component. TailwindCSS assumed available in the project.
// Features:
// - Dynamic list of animals (mock data)
// - Search + filter by species/age
// - Adoption modal with simple validation
// - Contact & donate forms (simulate submission)
// - LocalStorage: saved adoptions

export default function AnimalWelfareApp() {
  // Mock data (would normally come from an API)
  const initialAnimals = [
    {
      id: 1,
      name: "Maya",
      species: "Dog",
      age: 3,
      sex: "Female",
      desc: "Friendly, good with kids, vaccinated.",
      image: "https://place-puppy.com/400x300",
    },
    {
      id: 2,
      name: "Chintu",
      species: "Cat",
      age: 2,
      sex: "Male",
      desc: "Indoor cat, loves naps and sunbeams.",
      image: "https://placekitten.com/400/300",
    },
    {
      id: 3,
      name: "Kaju",
      species: "Rabbit",
      age: 1,
      sex: "Female",
      desc: "Gentle and playful — needs a calm home.",
      image: "https://place-rabbit.com/400x300",
    },
    {
      id: 4,
      name: "Bruno",
      species: "Dog",
      age: 6,
      sex: "Male",
      desc: "Calm senior dog, house-trained.",
      image: "https://place-puppy.com/401x301",
    },
  ];

  const [animals, setAnimals] = useState(() => {
    // simulate fetch delay
    return initialAnimals;
  });
  const [query, setQuery] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  // adoption modal
  const [selected, setSelected] = useState(null);
  const [showAdoptModal, setShowAdoptModal] = useState(false);
  const [adopterName, setAdopterName] = useState("");
  const [adopterEmail, setAdopterEmail] = useState("");
  const [adoptSuccess, setAdoptSuccess] = useState("");

  // contact/donate
  const [contactMsg, setContactMsg] = useState("");
  const [donationAmt, setDonationAmt] = useState(0);
  const [flash, setFlash] = useState("");

  // saved adoptions in localStorage
  const [adopted, setAdopted] = useState(() => {
    try {
      const raw = localStorage.getItem("adopted_animals");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("adopted_animals", JSON.stringify(adopted));
  }, [adopted]);

  // derived list
  const filtered = animals
    .filter((a) => (speciesFilter === "All" ? true : a.species === speciesFilter))
    .filter((a) => a.name.toLowerCase().includes(query.toLowerCase()))
    .sort((x, y) => {
      if (sortBy === "ageAsc") return x.age - y.age;
      if (sortBy === "ageDesc") return y.age - x.age;
      return y.id - x.id; // newest first
    });

  // helpers
  function openAdopt(animal) {
    setSelected(animal);
    setShowAdoptModal(true);
    setAdopterName("");
    setAdopterEmail("");
    setAdoptSuccess("");
  }

  function submitAdoption(e) {
    e.preventDefault();
    if (!adopterName.trim() || !adopterEmail.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
      setAdoptSuccess("Please enter a valid name and email.");
      return;
    }
    const record = {
      animalId: selected.id,
      animalName: selected.name,
      adopterName: adopterName.trim(),
      adopterEmail: adopterEmail.trim(),
      date: new Date().toISOString(),
    };
    setAdopted((s) => [record, ...s]);
    setAdoptSuccess("Adoption request submitted — we will contact you soon!");
    // mark as adopted in UI
    setAnimals((prev) => prev.filter((p) => p.id !== selected.id));
    setTimeout(() => setShowAdoptModal(false), 1200);
  }

  function submitContact(e) {
    e.preventDefault();
    if (!contactMsg.trim()) {
      setFlash("Please write a message.");
      setTimeout(() => setFlash(""), 1500);
      return;
    }
    setFlash("Message sent — thank you! We will reply soon.");
    setContactMsg("");
    setTimeout(() => setFlash(""), 2200);
  }

  function submitDonation(e) {
    e.preventDefault();
    if (donationAmt <= 0) {
      setFlash("Enter a valid donation amount.");
      setTimeout(() => setFlash(""), 1500);
      return;
    }
    setFlash(`Thank you for donating ₹${donationAmt}!`);
    setDonationAmt(0);
    setTimeout(() => setFlash(""), 2200);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 p-6">
      <header className="max-w-6xl mx-auto flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold">PashuCare — Animal Welfare</h1>
          <p className="text-sm text-slate-600">Rescue · Rehabilitate · Rehome</p>
        </div>
        <nav className="flex gap-3 items-center">
          <button
            className="px-3 py-2 rounded-lg bg-sky-600 text-white text-sm"
            onClick={() => window.scrollTo({ top: 600, behavior: "smooth" })}
          >
            Adopt
          </button>
          <button
            className="px-3 py-2 rounded-lg bg-rose-500 text-white text-sm"
            onClick={() => window.scrollTo({ top: 1400, behavior: "smooth" })}
          >
            Donate
          </button>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: hero + about */}
        <section className="lg:col-span-2 bg-white rounded-2xl p-6 shadow">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <img
                src="https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=abcd"
                alt="animals"
                className="w-full md:w-1/2 rounded-lg object-cover h-64"
              />
              <div>
                <h2 className="text-2xl font-bold">Our mission</h2>
                <p className="mt-2 text-slate-700">
                  We rescue, rehabilitate and rehome stray and abandoned animals. We also run
                  awareness programs and low-cost vaccination camps.
                </p>
                <div className="mt-4 flex gap-2">
                  <button
                    className="px-3 py-2 rounded-lg bg-green-600 text-white"
                    onClick={() => window.scrollTo({ top: 600, behavior: "smooth" })}
                  >
                    See Animals
                  </button>
                  <button
                    className="px-3 py-2 rounded-lg border"
                    onClick={() => window.scrollTo({ top: 1200, behavior: "smooth" })}
                  >
                    Volunteer
                  </button>
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <StatCard title="Rescued" value="1,234+" />
              <StatCard title="Adopted" value={adopted.length || "0"} />
              <StatCard title="Volunteers" value="85" />
            </div>

            {/* Search/filters */}
            <div className="mt-6 border rounded-lg p-4 flex flex-col md:flex-row gap-4 items-center">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name..."
                className="flex-1 p-2 border rounded-lg"
              />
              <select
                value={speciesFilter}
                onChange={(e) => setSpeciesFilter(e.target.value)}
                className="p-2 border rounded-lg"
              >
                <option>All</option>
                <option>Dog</option>
                <option>Cat</option>
                <option>Rabbit</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="p-2 border rounded-lg"
              >
                <option value="newest">Newest</option>
                <option value="ageAsc">Age: Low → High</option>
                <option value="ageDesc">Age: High → Low</option>
              </select>
            </div>

            {/* Animals grid */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.length === 0 ? (
                <div className="p-6 text-center text-slate-600">No animals match your search.</div>
              ) : (
                filtered.map((a) => (
                  <motion.article
                    key={a.id}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-50 rounded-lg p-4 flex gap-4 items-center"
                  >
                    <img src={a.image} alt={a.name} className="w-28 h-20 object-cover rounded-md" />
                    <div className="flex-1">
                      <h3 className="font-semibold">{a.name} <span className="text-sm text-slate-500">· {a.species}</span></h3>
                      <p className="text-sm text-slate-600">{a.desc}</p>
                      <div className="mt-2 flex gap-2">
                        <button
                          className="px-3 py-1 bg-sky-600 text-white rounded"
                          onClick={() => openAdopt(a)}
                        >
                          Adopt
                        </button>
                        <button
                          className="px-3 py-1 border rounded"
                          onClick={() => alert(`More about ${a.name}: Age ${a.age}, ${a.sex}`)}
                        >
                          Details
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-slate-500">{a.age} yrs</div>
                  </motion.article>
                ))
              )}
            </div>

            {/* Adopted list (collapsible) */}
            <div className="mt-6">
              <h4 className="font-bold">Recent adoption requests</h4>
              <div className="mt-2 space-y-2">
                {adopted.length === 0 ? (
                  <div className="text-sm text-slate-600">No adoption requests yet.</div>
                ) : (
                  adopted.map((r, i) => (
                    <div key={i} className="p-3 bg-white rounded shadow-sm flex justify-between">
                      <div>
                        <div className="font-semibold">{r.animalName}</div>
                        <div className="text-sm text-slate-500">by {r.adopterName}</div>
                      </div>
                      <div className="text-xs text-slate-400">{new Date(r.date).toLocaleString()}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Right column: contact + donate + services */}
        <aside className="space-y-4">
          <div className="bg-white rounded-2xl p-4 shadow">
            <h3 className="font-semibold">Contact</h3>
            <form className="mt-2" onSubmit={submitContact}>
              <textarea
                value={contactMsg}
                onChange={(e) => setContactMsg(e.target.value)}
                placeholder="Write a message..."
                className="w-full p-2 border rounded h-24"
              />
              <div className="mt-2 flex gap-2">
                <button className="px-3 py-2 bg-sky-600 text-white rounded">Send</button>
                <div className="text-sm text-slate-500">{flash}</div>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow">
            <h3 className="font-semibold">Donate</h3>
            <form className="mt-2" onSubmit={submitDonation}>
              <input
                type="number"
                value={donationAmt}
                onChange={(e) => setDonationAmt(Number(e.target.value))}
                placeholder="Amount (INR)"
                className="w-full p-2 border rounded"
              />
              <div className="mt-2 flex gap-2">
                <button className="px-3 py-2 bg-rose-500 text-white rounded">Donate</button>
                <div className="text-sm text-slate-500">{flash}</div>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow">
            <h3 className="font-semibold">Services</h3>
            <ul className="mt-2 text-sm text-slate-600 space-y-1">
              <li>Rescue & Emergency Care</li>
              <li>Vaccination Camps</li>
              <li>Foster & Adoption</li>
              <li>Awareness & Education</li>
            </ul>
          </div>
        </aside>
      </main>

      {/* Volunteer / info section */}
      <section className="max-w-6xl mx-auto mt-10 bg-white rounded-xl p-6 shadow">
        <h3 className="text-xl font-bold">Volunteer with us</h3>
        <p className="mt-2 text-slate-700">Join weekend rescue drives, help at adoption camps, or assist with social media.</p>
        <div className="mt-4 flex gap-3">
          <button
            className="px-4 py-2 bg-green-600 text-white rounded"
            onClick={() => alert("Thanks — our volunteer coordinator will reach out!")}
          >
            Sign up
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto mt-8 text-center text-sm text-slate-500">
        © PashuCare — Built with ❤️
      </footer>

      {/* Adopt Modal */}
      {showAdoptModal && selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg"
          >
            <h4 className="font-bold text-lg">Adopt {selected.name}</h4>
            <p className="text-sm text-slate-600">Please enter your details — we will get in touch.</p>
            <form className="mt-3" onSubmit={submitAdoption}>
              <input
                value={adopterName}
                onChange={(e) => setAdopterName(e.target.value)}
                placeholder="Your name"
                className="w-full p-2 border rounded my-2"
              />
              <input
                value={adopterEmail}
                onChange={(e) => setAdopterEmail(e.target.value)}
                placeholder="Email"
                className="w-full p-2 border rounded my-2"
              />
              <div className="flex gap-2 justify-end mt-3">
                <button type="button" className="px-3 py-2 border rounded" onClick={() => setShowAdoptModal(false)}>
                  Cancel
                </button>
                <button className="px-3 py-2 bg-sky-600 text-white rounded">Submit</button>
              </div>
              <div className="mt-2 text-sm text-rose-600">{adoptSuccess}</div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// Small stat card component
function StatCard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="text-xs text-slate-500">{title}</div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
}
