import React, { useEffect, useState } from "react";
import PageLayout from "../components/PageLayout";
import api from "../services/api";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasApi, setHasApi] = useState(true);

  useEffect(() => {
    api
      .get("/bookings")
      .then((res) => {
        setBookings(res.data);
        setLoading(false);
      })
      .catch(() => {
        setHasApi(false);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <PageLayout title="My Bookings">
        <p className="text-center">Loading…</p>
      </PageLayout>
    );
  }

  if (!hasApi) {
    return (
      <PageLayout title="My Bookings">
        <p className="text-center text-gray-600">No booking data available.</p>
      </PageLayout>
    );
  }

  if (bookings.length === 0) {
    return (
      <PageLayout title="My Bookings">
        <p className="text-center text-gray-600">You have no bookings yet.</p>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="My Bookings">
      <ul className="space-y-4">
        {bookings.map((b) => (
          <li key={b.id} className="border p-4 rounded shadow-sm bg-white">
            <p><strong>Booking ID:</strong> {b.id}</p>
            <p><strong>Destination:</strong> {b.destination || "N/A"}</p>
            <p><strong>Date:</strong> {b.date || "N/A"}</p>
          </li>
        ))}
      </ul>
    </PageLayout>
  );
}

