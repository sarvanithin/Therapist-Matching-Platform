// app/admin/therapists/manage/page.tsx
import { DatabaseService } from "@/services/database-service";

export default async function ManageTherapistsPage() {
  const therapists = await DatabaseService.getAllTherapists();

  return (
    <div>
      <h1>Manage Therapists</h1>
      <ul>
        {therapists.map(t => (
          <li key={t.id}>{t.name} — {t.email}</li>
        ))}
      </ul>
    </div>
  );
}
