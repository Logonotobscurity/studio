'use client';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Loader2 } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Suggest a Tool',
  description: 'Have a tool that should be on StartIT? Let us know!',
};

const formSchema = z.object({
  toolName: z.string().min(2, 'Tool name must be at least 2 characters.'),
  toolUrl: z.string().url('Please enter a valid URL.'),
  description: z.string().min(10, 'Description must be at least 10 characters.').max(500, 'Description must be 500 characters or less.'),
  suggesterEmail: z.string().email('Please enter a valid email.').optional().or(z.literal('')),
});

type FormData = z.infer<typeof formSchema>;

export default function SuggestToolPage() {
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      toolName: '',
      toolUrl: '',
      description: '',
      suggesterEmail: '',
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    // Simulate API submission
    console.log('Submitting tool suggestion:', data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: 'Suggestion Received!',
      description: "Thanks for helping us grow! We'll review your suggestion shortly.",
    });
    form.reset();
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold tracking-tight font-headline">Suggest a Tool</CardTitle>
            <CardDescription>
              Help the community by suggesting a tool you love. If it's a good fit, we'll add it to our platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="toolName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tool Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Notion" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="toolUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tool Website URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://www.notion.so" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Why is this tool great?</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the tool and why it's a must-have for growth enthusiasts..."
                          {...field}
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="suggesterEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Email (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="So we can thank you!" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                   {form.formState.isSubmitting ? (
                    <Loader2 className="animate-spin" />
                   ) : (
                    <>
                      Submit Suggestion
                      <Send className="ml-2 h-4 w-4" />
                    </>
                   )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
