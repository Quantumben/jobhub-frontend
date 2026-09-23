import { useAppSelector } from "../../app/hooks";

function ProfilePage() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>

        <p className="mt-2 text-gray-600">Manage your account information.</p>
      </div>

      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 sm:p-8">
        <div>
          <p className="text-sm font-medium text-gray-500">Name</p>

          <p className="mt-1 font-medium text-gray-900">{user?.name}</p>
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium text-gray-500">Email</p>

          <p className="mt-1 font-medium text-gray-900">{user?.email}</p>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
