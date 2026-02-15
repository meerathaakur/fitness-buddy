import Card from "../../common/Card";
import RegisterForm from "./RegisterForm";
import SocialAuth from "./SocialAuth";

export default function Register() {
  return (
    <Card className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
        <p className="text-gray-600 mt-2">Join the FitnessBuddy community</p>
      </div>

      <RegisterForm />
      
      <div className="mt-6">
        <SocialAuth mode="register" />
      </div>
    </Card>
  )
}