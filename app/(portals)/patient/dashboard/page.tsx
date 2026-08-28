"use client";
import { logoutPatient } from "@/actions/auth";
import { Button, Form } from "react-aria-components";

export default function PatientDashboardPage() {
  return (
    <div>
      <h1>Patient Dashboard Page</h1>
      <Form action={logoutPatient}>
        <Button type="submit">Sign Out</Button>
      </Form>
    </div>
  );
}
