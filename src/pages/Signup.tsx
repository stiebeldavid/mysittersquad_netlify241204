import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { createUser, findUserByMobile } from "@/lib/airtable";
import { useAuthStore } from "@/store/authStore";
import { PhoneNumberInput } from "@/components/ui/phone-input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const existingUser = await findUserByMobile(formData.mobile);
      if (existingUser) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "A user with this mobile number already exists.",
        });
        return;
      }

      const record = await createUser(
        formData.firstName,
        formData.lastName,
        formData.mobile
      );

      if (record) {
        setUser({
          id: record.id,
          firstName: record.fields['First Name'] as string,
          lastName: record.fields['Last Name'] as string,
          mobile: record.fields.Mobile as string,
        });
        navigate('/');
        toast({
          title: "Welcome to MySitterSquad!",
          description: "Your account has been created successfully.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create account. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('/lovable-uploads/174009da-8c34-4772-9bae-d734e0d5f625.png')",
        }}
      >
        <div className="absolute inset-0 bg-white/10" />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-12 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Headlines */}
            <div className="space-y-6 p-6 rounded-lg bg-black/10 backdrop-blur-sm">
              <h1 className="hidden sm:block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4 text-shadow-lg">
                MySitterSquad
              </h1>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white leading-tight animate-slide-up text-shadow-lg">
                Book Trusted Babysitters in Seconds
              </h2>
              <p className="text-xl text-white text-shadow">
                Say goodbye to scheduling stress—arrange reliable child care in just a few clicks!
              </p>
            </div>

            {/* Right Column - Sign Up Form */}
            <Card className="p-4 bg-white/90 shadow-xl animate-slide-up">
              <CardContent className="pt-0 pb-2">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Sign Up For Free</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    placeholder="First Name"
                    className="bg-white/80 border-gray-200"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    required
                  />
                  <Input
                    placeholder="Last Name"
                    className="bg-white/80 border-gray-200"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    required
                  />
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <PhoneNumberInput
                      id="mobile"
                      value={formData.mobile}
                      onChange={(value) =>
                        setFormData({ ...formData, mobile: value || "" })
                      }
                      placeholder="Enter your mobile number"
                      className="bg-white/80 border-gray-200"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Sign Up"}
                  </Button>
                  <p className="text-center text-gray-600 mb-0">
                    Already have an account?{" "}
                    <Button 
                      variant="link" 
                      onClick={() => navigate("/login")}
                      className="text-primary hover:text-primary/90 p-0"
                    >
                      Login
                    </Button>
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white/80 py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="space-y-4 text-center p-6 rounded-lg hover:bg-white/80 transition-colors">
                <h3 className="text-2xl font-semibold text-gray-800">Your Trusted Network</h3>
                <p className="text-gray-600">
                  Interact and request babysitting from people you already know and trust. No strangers.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="space-y-4 text-center p-6 rounded-lg hover:bg-white/80 transition-colors">
                <h3 className="text-2xl font-semibold text-gray-800">One-Click Requests</h3>
                <p className="text-gray-600">
                  Send your request to multiple babysitters with one click. Avoid the messaging chaos.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="space-y-4 text-center p-6 rounded-lg hover:bg-white/80 transition-colors">
                <h3 className="text-2xl font-semibold text-gray-800">Easy Scheduling</h3>
                <p className="text-gray-600">
                  Create and manage babysitting requests effortlessly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;