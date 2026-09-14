import { PageHeader } from "@/components/ui/page-header";
import { UserManager } from "@/features/users/components/user-manager";

export const metadata = {
  title: "Customers & Users | Clean7 Admin",
};

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="User & Customer Management"
        description="Browse, filter, edit details, unlink phone numbers, and manage all user accounts across Clean7."
      />

      <UserManager />
    </div>
  );
}
