import { NextResponse } from "next/server";
import { getDbStore, saveDbStore, Booking } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      type,
      studentName,
      parentName,
      email,
      phone,
      currentSchool,
      currentQualification,
      intendedDegree,
      preferredField,
      preferredCountries,
      preferredDate,
      preferredTime,
      description,
      expectedIntake,
      scholarshipRequired,
      academicGrades,
      englishTestStatus,
      preferredBatchTiming,
      requiredService,
      sessionDuration,
    } = body;

    if (!type || !studentName || !email || !phone) {
      return NextResponse.json(
        { error: "Missing required fields (type, name, email, phone)." },
        { status: 400 }
      );
    }

    const newBooking: Booking = {
      id: `b-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      type,
      studentName,
      parentName,
      email,
      phone,
      currentSchool,
      currentQualification,
      intendedDegree,
      preferredField,
      preferredCountries,
      preferredDate,
      preferredTime,
      description,
      expectedIntake,
      scholarshipRequired,
      academicGrades,
      englishTestStatus,
      preferredBatchTiming,
      requiredService,
      sessionDuration,
      createdAt: new Date().toISOString(),
    };

    const store = getDbStore();
    store.bookings = [newBooking, ...(store.bookings || [])];
    saveDbStore(store);

    return NextResponse.json({ success: true, booking: newBooking });
  } catch (error: any) {
    console.error("Booking API error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process booking request." },
      { status: 500 }
    );
  }
}
