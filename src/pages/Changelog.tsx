import React from 'react';
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCircle, BookOpen, ExternalLink } from 'lucide-react';

const Changelog: React.FC = () => {
  const volumes = [
    {
      title: 'Volume 1 - The Divine Plan of the Ages',
      status: 'available' as const,
      link: 'https://v1.foodfornewcreature.com/',
    },
    {
      title: 'Volume 2 - The Time is at Hand',
      status: 'available' as const,
      link: 'https://v2.foodfornewcreature.com/',
    },
    {
      title: 'Volume 3 - Thy Kingdom Come',
      status: 'coming_soon' as const,
      link: null,
    },
    {
      title: 'Volume 4 - The Battle of Armageddon',
      status: 'coming_soon' as const,
      link: null,
    },
    {
      title: 'Volume 5 - The Atonement Between God and Man',
      status: 'coming_soon' as const,
      link: null,
    },
    {
      title: 'Volume 6 - The New Creation',
      status: 'current' as const,
      link: 'https://v6.foodfornewcreature.com/',
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen py-8 px-4 animate-fade-in">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Page Title */}
          <section className="text-center animate-fade-in">
            <h1 className="text-3xl font-bold text-foreground mb-2">Studies in the Scriptures</h1>
            <p className="text-muted-foreground">Explore the complete series of Volumes Studies</p>
          </section>

          {/* Volumes Section */}
          <section className="animate-fade-in">
            <div className="grid grid-cols-1 gap-4">
              {volumes.map((volume, index) => (
                <Card 
                  key={index} 
                  className="animate-fade-in [animation-delay:calc(0.1s*var(--i))]" 
                  style={{ '--i': index } as React.CSSProperties}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          <BookOpen className="h-10 w-10 text-accent" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold text-foreground">
                            {volume.title}
                          </CardTitle>
                          {volume.status === 'current' && (
                            <Badge variant="default" className="mt-1 bg-primary">Current Volume</Badge>
                          )}
                          {volume.status === 'coming_soon' && (
                            <Badge variant="outline" className="mt-1">Coming Soon</Badge>
                          )}
                          {volume.status === 'available' && (
                            <Badge variant="secondary" className="mt-1">Available</Badge>
                          )}
                        </div>
                      </div>
                      <div>
                        {volume.link ? (
                          <Button 
                            asChild 
                            variant={volume.status === 'current' ? 'default' : 'outline'}
                            className={volume.status === 'current' ? 'bg-accent hover:bg-accent/90 text-accent-foreground' : ''}
                          >
                            <a 
                              href={volume.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-2"
                            >
                              {volume.status === 'current' ? 'Read Here' : 'Read Now'}
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        ) : (
                          <Button disabled variant="outline">
                            Coming Soon
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Contact Us Section */}
          <section className="animate-fade-in">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-accent-foreground">Contact Us</CardTitle>
                <CardDescription>
                  Reach out for corrections, suggestions, or help.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center pb-6">
                <Button 
                  asChild 
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  size="lg"
                >
                  <a 
                    href="https://wa.me/919790369256?text=Shalom%20Brother" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Contact via WhatsApp
                  </a>
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Changelog;
