
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { User, Building2, Heart, Award } from "lucide-react";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-brand-purple to-brand-blue text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About PixelStore</h1>
            <p className="text-xl max-w-3xl mx-auto opacity-90">
              We're on a mission to provide the highest quality digital products to creators, designers, and developers worldwide.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
            <div className="prose prose-lg max-w-none">
              <p className="mb-4">
                PixelStore was founded in 2022 with a simple yet powerful idea: to create a marketplace where digital creators could find high-quality resources to enhance their projects and workflows.
              </p>
              <p className="mb-4">
                What started as a small collection of templates has grown into a comprehensive library of digital products spanning multiple categories including templates, graphics, and software tools. Our team of passionate designers and developers work tirelessly to ensure that each product meets our high standards for quality and usability.
              </p>
              <p>
                Today, PixelStore serves thousands of customers worldwide, from independent creators to leading design agencies and tech companies. We're proud to be a part of the creative process for so many talented individuals and teams.
              </p>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white">
                <CardHeader className="text-center">
                  <div className="mx-auto bg-brand-purple/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <Award className="h-8 w-8 text-brand-purple" />
                  </div>
                  <CardTitle>Quality</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription>
                    We never compromise on quality. Every product undergoes rigorous testing and review.
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardHeader className="text-center">
                  <div className="mx-auto bg-brand-purple/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <Heart className="h-8 w-8 text-brand-purple" />
                  </div>
                  <CardTitle>Passion</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription>
                    We're passionate about design and technology, and it shows in everything we create.
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardHeader className="text-center">
                  <div className="mx-auto bg-brand-purple/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <User className="h-8 w-8 text-brand-purple" />
                  </div>
                  <CardTitle>Community</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription>
                    We believe in fostering a supportive community of creators sharing knowledge and inspiration.
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="bg-white">
                <CardHeader className="text-center">
                  <div className="mx-auto bg-brand-purple/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <Building2 className="h-8 w-8 text-brand-purple" />
                  </div>
                  <CardTitle>Innovation</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription>
                    We're constantly innovating and pushing boundaries to create better products.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Michael Johnson" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold">Michael Johnson</h3>
              <p className="text-brand-purple">Founder & CEO</p>
              <p className="mt-2 text-gray-600">
                Former design agency creative director with 15+ years experience in digital product design.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2187&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Sarah Chen" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold">Sarah Chen</h3>
              <p className="text-brand-purple">Chief Design Officer</p>
              <p className="mt-2 text-gray-600">
                Award-winning UI/UX designer with expertise in creating intuitive and beautiful interfaces.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="David Rodriguez" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold">David Rodriguez</h3>
              <p className="text-brand-purple">Head of Development</p>
              <p className="mt-2 text-gray-600">
                Full-stack developer passionate about creating tools that empower designers and creators.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-brand-purple text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
              Discover our premium digital products and become part of our growing community of creators.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-brand-purple hover:bg-white/90">
                <Link to="/products">Browse Products</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
