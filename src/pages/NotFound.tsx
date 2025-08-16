import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/AppSidebar"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-canvas">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center max-w-md mx-auto p-6">
              <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl font-bold text-red-600">404</span>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-4">Page Not Found</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Sorry, we couldn't find the page you're looking for. It may have been moved or deleted.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/dashboard">
                  <Button className="w-full sm:w-auto">
                    <Home className="w-4 h-4 mr-2" />
                    Go to Dashboard
                  </Button>
                </Link>
                <Button variant="outline" onClick={() => window.history.back()} className="w-full sm:w-auto">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default NotFound;
