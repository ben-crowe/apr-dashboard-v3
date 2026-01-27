import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Toggle } from '@/components/ui/toggle';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FileText } from 'lucide-react';

export default function StyleGuide() {
  const [toggle1, setToggle1] = useState(false);
  const [toggle2, setToggle2] = useState(false);
  const [switch1, setSwitch1] = useState(false);
  const [switch2, setSwitch2] = useState(true);
  const [darkToggle1, setDarkToggle1] = useState(false);
  const [darkToggle2, setDarkToggle2] = useState(false);
  const [darkSwitch1, setDarkSwitch1] = useState(false);
  const [darkSwitch2, setDarkSwitch2] = useState(true);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">APR Dashboard V3 - Style Guide</h1>
        <p className="text-muted-foreground mb-8">
          Reference for buttons, form fields, inputs, and typography in both light and dark modes
        </p>

        {/* Light/Dark Mode Side-by-Side Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Light Mode Column */}
          <div className="space-y-8">
            <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Light Mode</h2>
                <Badge variant="outline" className="border-gray-300 text-gray-700">Light</Badge>
              </div>

              {/* Typography */}
              <section className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Typography</h3>
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold text-gray-800">Heading 1</h1>
                  <h2 className="text-3xl font-semibold text-gray-800">Heading 2</h2>
                  <h3 className="text-2xl font-semibold text-gray-800">Heading 3</h3>
                  <h4 className="text-xl font-medium text-gray-800">Heading 4</h4>
                  <p className="text-base text-gray-700">Body text - Regular paragraph text</p>
                  <p className="text-sm text-gray-600">Small text - Secondary information</p>
                  <p className="text-xs text-gray-500">Extra small - Captions and labels</p>
                </div>
              </section>

              <Separator className="my-6" />

              {/* Buttons - Dashboard Style (Text Only) */}
              <section className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Buttons - Dashboard Style</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Primary Action (Text Only)</p>
                    <div className="flex gap-2 flex-wrap">
                      <button className="text-gray-800 hover:text-gray-600 hover:underline transition-colors text-sm font-medium">
                        Save Changes
                      </button>
                      <button className="text-gray-800 hover:text-gray-600 hover:underline transition-colors text-sm font-medium">
                        Create Job
                      </button>
                      <button className="text-gray-800 hover:text-gray-600 hover:underline transition-colors text-sm font-medium">
                        Send to Client
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Secondary Action</p>
                    <div className="flex gap-2 flex-wrap">
                      <button className="text-gray-600 hover:text-gray-800 hover:underline transition-colors text-sm">
                        Cancel
                      </button>
                      <button className="text-gray-600 hover:text-gray-800 hover:underline transition-colors text-sm">
                        Edit
                      </button>
                      <button className="text-gray-600 hover:text-gray-800 hover:underline transition-colors text-sm">
                        View Details
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Disabled State</p>
                    <button className="text-gray-400 cursor-not-allowed text-sm" disabled>
                      Disabled Action
                    </button>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Begin Report Button (Text-Only Style)</p>
                    <p className="text-xs text-gray-500 mb-2">Text-only button with color change on hover, no border or background</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors text-sm font-medium hover:bg-transparent dark:hover:bg-transparent"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      Begin Report
                    </Button>
                  </div>
                </div>
              </section>

              <Separator className="my-6" />

              {/* Link Buttons */}
              <section className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Link Buttons</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">External Links</p>
                    <div className="flex gap-2 flex-wrap">
                      <a 
                        href="https://example.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline transition-colors text-sm font-medium"
                      >
                        View in Valcre
                      </a>
                      <a 
                        href="https://example.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline transition-colors text-sm font-medium"
                      >
                        Open in ClickUp
                      </a>
                      <a 
                        href="https://example.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline transition-colors text-sm font-medium"
                      >
                        View Document
                      </a>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Internal Navigation</p>
                    <div className="flex gap-2 flex-wrap">
                      <button className="text-blue-600 hover:text-blue-800 hover:underline transition-colors text-sm">
                        Go to Dashboard
                      </button>
                      <button className="text-blue-600 hover:text-blue-800 hover:underline transition-colors text-sm">
                        View All Jobs
                      </button>
                      <button className="text-blue-600 hover:text-blue-800 hover:underline transition-colors text-sm">
                        Settings
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Disabled Link</p>
                    <button className="text-gray-400 cursor-not-allowed text-sm" disabled>
                      Disabled Link
                    </button>
                  </div>
                </div>
              </section>

              <Separator className="my-6" />

              {/* Form Fields */}
              <section className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Form Fields</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="light-input-text" className="text-sm font-medium text-gray-800">
                      Text Input
                    </Label>
                    <Input
                      id="light-input-text"
                      type="text"
                      placeholder="Enter text..."
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="light-input-email" className="text-sm font-medium text-gray-800">
                      Email Input
                    </Label>
                    <Input
                      id="light-input-email"
                      type="email"
                      placeholder="name@example.com"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="light-textarea" className="text-sm font-medium text-gray-800">
                      Textarea
                    </Label>
                    <Textarea
                      id="light-textarea"
                      placeholder="Enter longer text..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="light-select" className="text-sm font-medium text-gray-800">
                      Select Dropdown
                    </Label>
                    <Select>
                      <SelectTrigger id="light-select" className="mt-1">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="option1" className="text-gray-900">Option 1</SelectItem>
                        <SelectItem value="option2" className="text-gray-900">Option 2</SelectItem>
                        <SelectItem value="option3" className="text-gray-900">Option 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="light-checkbox" />
                    <Label htmlFor="light-checkbox" className="text-sm text-gray-800 cursor-pointer">
                      Checkbox option
                    </Label>
                  </div>
                </div>
              </section>

              <Separator className="my-6" />

              {/* Toggles */}
              <section className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Toggles</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Toggle Button</p>
                    <div className="flex gap-2 flex-wrap items-center">
                      <Toggle 
                        pressed={toggle1} 
                        onPressedChange={setToggle1}
                        aria-label="Toggle option 1"
                        className="text-gray-800 hover:bg-gray-200 hover:text-gray-900 data-[state=on]:bg-gray-300 data-[state=on]:text-gray-900"
                      >
                        Toggle Option 1
                      </Toggle>
                      <Toggle 
                        pressed={toggle2} 
                        onPressedChange={setToggle2}
                        variant="outline"
                        aria-label="Toggle option 2"
                        className="text-gray-800 border-gray-300 hover:bg-gray-200 hover:text-gray-900 data-[state=on]:bg-gray-300 data-[state=on]:text-gray-900"
                      >
                        Toggle Option 2
                      </Toggle>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Switch</p>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="switch-1" 
                          checked={switch1}
                          onCheckedChange={setSwitch1}
                          className="data-[state=unchecked]:bg-gray-300 data-[state=checked]:bg-gray-600 [&>span]:bg-white"
                        />
                        <Label htmlFor="switch-1" className="text-sm text-gray-800 cursor-pointer">
                          Enable notifications
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="switch-2" 
                          checked={switch2}
                          onCheckedChange={setSwitch2}
                          className="data-[state=unchecked]:bg-gray-300 data-[state=checked]:bg-gray-600 [&>span]:bg-white"
                        />
                        <Label htmlFor="switch-2" className="text-sm text-gray-800 cursor-pointer">
                          Auto-save enabled
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <Separator className="my-6" />

              {/* Toggle Dropdown (Accordion) */}
              <section className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Toggle Dropdown (Accordion)</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Single Item Accordion</p>
                    <Accordion type="single" collapsible className="w-full border border-gray-300 rounded-lg bg-gray-100">
                      <AccordionItem value="item-1" className="border-none">
                        <AccordionTrigger className="px-4 hover:no-underline text-gray-800">
                          Section 1: Client Submission Info
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 pt-2">
                          <div className="space-y-2 text-sm text-gray-700">
                            <p>This is the content inside the accordion section.</p>
                            <p>You can add any content here - forms, text, buttons, etc.</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Multiple Items Accordion</p>
                    <Accordion type="multiple" className="w-full border border-gray-300 rounded-lg bg-gray-100">
                      <AccordionItem value="item-1" className="border-b border-gray-300">
                        <AccordionTrigger className="px-4 hover:no-underline text-gray-800">
                          Section 1: Client Information
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 pt-2">
                          <div className="space-y-2 text-sm text-gray-700">
                            <p>Client name, email, phone, and organization details.</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2" className="border-b border-gray-300">
                        <AccordionTrigger className="px-4 hover:no-underline text-gray-800">
                          Section 2: Property Details
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 pt-2">
                          <div className="space-y-2 text-sm text-gray-700">
                            <p>Property address, type, and related information.</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3" className="border-none">
                        <AccordionTrigger className="px-4 hover:no-underline text-gray-800">
                          Section 3: Documents
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 pt-2">
                          <div className="space-y-2 text-sm text-gray-700">
                            <p>Upload and manage related documents.</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>
              </section>

              <Separator className="my-6" />

              {/* Cards */}
              <section className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Cards</h3>
                <Card className="bg-gray-100 border-gray-300 text-gray-900">
                  <CardHeader>
                    <CardTitle className="text-gray-900 font-semibold !text-gray-900">Card Title</CardTitle>
                    <CardDescription className="text-gray-700 !text-gray-700">
                      Card description text
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-800 !text-gray-800">Card content goes here</p>
                  </CardContent>
                </Card>
              </section>

              <Separator className="my-6" />

              {/* Badges */}
              <section className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Badges</h3>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </div>
              </section>
            </div>
          </div>

          {/* Dark Mode Column */}
          <div className="space-y-8">
            <div className="bg-gray-900 border-2 border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white">Dark Mode</h2>
                <Badge variant="outline" className="border-gray-600 text-gray-300">Dark</Badge>
              </div>

              {/* Typography */}
              <section className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-white">Typography</h3>
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold text-white">Heading 1</h1>
                  <h2 className="text-3xl font-semibold text-white">Heading 2</h2>
                  <h3 className="text-2xl font-semibold text-white">Heading 3</h3>
                  <h4 className="text-xl font-medium text-white">Heading 4</h4>
                  <p className="text-base text-gray-300">Body text - Regular paragraph text</p>
                  <p className="text-sm text-gray-400">Small text - Secondary information</p>
                  <p className="text-xs text-gray-500">Extra small - Captions and labels</p>
                </div>
              </section>

              <Separator className="my-6 bg-gray-700" />

              {/* Buttons - Dashboard Style (Text Only) */}
              <section className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-white">Buttons - Dashboard Style</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Primary Action (Text Only)</p>
                    <div className="flex gap-2 flex-wrap">
                      <button className="text-white hover:text-gray-300 hover:underline transition-colors text-sm font-medium">
                        Save Changes
                      </button>
                      <button className="text-white hover:text-gray-300 hover:underline transition-colors text-sm font-medium">
                        Create Job
                      </button>
                      <button className="text-white hover:text-gray-300 hover:underline transition-colors text-sm font-medium">
                        Send to Client
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Secondary Action</p>
                    <div className="flex gap-2 flex-wrap">
                      <button className="text-gray-400 hover:text-gray-200 hover:underline transition-colors text-sm">
                        Cancel
                      </button>
                      <button className="text-gray-400 hover:text-gray-200 hover:underline transition-colors text-sm">
                        Edit
                      </button>
                      <button className="text-gray-400 hover:text-gray-200 hover:underline transition-colors text-sm">
                        View Details
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400 mb-2">Disabled State</p>
                    <button className="text-gray-600 cursor-not-allowed text-sm" disabled>
                      Disabled Action
                    </button>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400 mb-2">Begin Report Button (Reference Style)</p>
                    <p className="text-xs text-gray-500 mb-2">Dark background with subtle border and hover edge effect</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 hover:underline transition-colors text-sm font-medium"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      Begin Report
                    </Button>
                  </div>
                </div>
              </section>

              <Separator className="my-6 bg-gray-700" />

              {/* Link Buttons */}
              <section className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-white">Link Buttons</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-2">External Links</p>
                    <div className="flex gap-2 flex-wrap">
                      <a 
                        href="https://example.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 hover:underline transition-colors text-sm font-medium"
                      >
                        View in Valcre
                      </a>
                      <a 
                        href="https://example.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 hover:underline transition-colors text-sm font-medium"
                      >
                        Open in ClickUp
                      </a>
                      <a 
                        href="https://example.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 hover:underline transition-colors text-sm font-medium"
                      >
                        View Document
                      </a>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Internal Navigation</p>
                    <div className="flex gap-2 flex-wrap">
                      <button className="text-blue-400 hover:text-blue-300 hover:underline transition-colors text-sm">
                        Go to Dashboard
                      </button>
                      <button className="text-blue-400 hover:text-blue-300 hover:underline transition-colors text-sm">
                        View All Jobs
                      </button>
                      <button className="text-blue-400 hover:text-blue-300 hover:underline transition-colors text-sm">
                        Settings
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400 mb-2">Disabled Link</p>
                    <button className="text-gray-600 cursor-not-allowed text-sm" disabled>
                      Disabled Link
                    </button>
                  </div>
                </div>
              </section>

              <Separator className="my-6 bg-gray-700" />

              {/* Form Fields */}
              <section className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-white">Form Fields</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="dark-input-text" className="text-sm font-medium text-white">
                      Text Input
                    </Label>
                    <Input
                      id="dark-input-text"
                      type="text"
                      placeholder="Enter text..."
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="dark-input-email" className="text-sm font-medium text-white">
                      Email Input
                    </Label>
                    <Input
                      id="dark-input-email"
                      type="email"
                      placeholder="name@example.com"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="dark-textarea" className="text-sm font-medium text-white">
                      Textarea
                    </Label>
                    <Textarea
                      id="dark-textarea"
                      placeholder="Enter longer text..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="dark-select" className="text-sm font-medium text-white">
                      Select Dropdown
                    </Label>
                    <Select>
                      <SelectTrigger id="dark-select" className="mt-1">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="option1" className="text-white">Option 1</SelectItem>
                        <SelectItem value="option2" className="text-white">Option 2</SelectItem>
                        <SelectItem value="option3" className="text-white">Option 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="dark-checkbox" className="border-gray-500 data-[state=checked]:bg-gray-600" />
                    <Label htmlFor="dark-checkbox" className="text-sm text-white cursor-pointer">
                      Checkbox option
                    </Label>
                  </div>
                </div>
              </section>

              <Separator className="my-6 bg-gray-700" />

              {/* Toggles */}
              <section className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-white">Toggles</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Toggle Button</p>
                    <div className="flex gap-2 flex-wrap items-center">
                      <Toggle 
                        pressed={darkToggle1} 
                        onPressedChange={setDarkToggle1}
                        aria-label="Toggle option 1"
                        className="text-white data-[state=on]:bg-gray-700 data-[state=on]:text-white hover:bg-gray-800"
                      >
                        Toggle Option 1
                      </Toggle>
                      <Toggle 
                        pressed={darkToggle2} 
                        onPressedChange={setDarkToggle2}
                        variant="outline"
                        aria-label="Toggle option 2"
                        className="text-white border-gray-600 hover:bg-gray-800 data-[state=on]:bg-gray-700 data-[state=on]:text-white"
                      >
                        Toggle Option 2
                      </Toggle>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400 mb-2">Switch</p>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="dark-switch-1" 
                          checked={darkSwitch1}
                          onCheckedChange={setDarkSwitch1}
                        />
                        <Label htmlFor="dark-switch-1" className="text-sm text-white cursor-pointer">
                          Enable notifications
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="dark-switch-2" 
                          checked={darkSwitch2}
                          onCheckedChange={setDarkSwitch2}
                        />
                        <Label htmlFor="dark-switch-2" className="text-sm text-white cursor-pointer">
                          Auto-save enabled
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <Separator className="my-6 bg-gray-700" />

              {/* Toggle Dropdown (Accordion) */}
              <section className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-white">Toggle Dropdown (Accordion)</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Single Item Accordion</p>
                    <Accordion type="single" collapsible className="w-full border border-gray-700 rounded-lg bg-gray-800/50">
                      <AccordionItem value="item-1" className="border-none">
                        <AccordionTrigger className="px-4 hover:no-underline text-white">
                          Section 1: Client Submission Info
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 pt-2">
                          <div className="space-y-2 text-sm text-gray-300">
                            <p>This is the content inside the accordion section.</p>
                            <p>You can add any content here - forms, text, buttons, etc.</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400 mb-2">Multiple Items Accordion</p>
                    <Accordion type="multiple" className="w-full border border-gray-700 rounded-lg bg-gray-800/50">
                      <AccordionItem value="item-1" className="border-b border-gray-700">
                        <AccordionTrigger className="px-4 hover:no-underline text-white">
                          Section 1: Client Information
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 pt-2">
                          <div className="space-y-2 text-sm text-gray-300">
                            <p>Client name, email, phone, and organization details.</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2" className="border-b border-gray-700">
                        <AccordionTrigger className="px-4 hover:no-underline text-white">
                          Section 2: Property Details
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 pt-2">
                          <div className="space-y-2 text-sm text-gray-300">
                            <p>Property address, type, and related information.</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3" className="border-none">
                        <AccordionTrigger className="px-4 hover:no-underline text-white">
                          Section 3: Documents
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 pt-2">
                          <div className="space-y-2 text-sm text-gray-300">
                            <p>Upload and manage related documents.</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>
              </section>

              <Separator className="my-6 bg-gray-700" />

              {/* Cards */}
              <section className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-white">Cards</h3>
                <div className="mb-2 text-sm text-gray-400">
                  Color: HSL(223, 20%, 17%) | Hex: #252932 | CSS: --card
                </div>
                <Card className="bg-[hsl(223,20%,17%)] border-gray-600 text-white">
                  <CardHeader>
                    <CardTitle className="text-white font-semibold !text-white">Card Title</CardTitle>
                    <CardDescription className="text-white !text-white">
                      Card description text
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-white !text-white">Card content goes here</p>
                  </CardContent>
                </Card>
              </section>

              <Separator className="my-6 bg-gray-700" />

              {/* Badges */}
              <section className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-white">Badges</h3>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="default" className="bg-gray-700 text-white border-gray-600">Default</Badge>
                  <Badge variant="secondary" className="bg-gray-800 text-gray-200 border-gray-700">Secondary</Badge>
                  <Badge variant="outline" className="border-gray-600 text-gray-200 bg-transparent">Outline</Badge>
                  <Badge variant="destructive" className="bg-red-600 text-white border-red-700">Destructive</Badge>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Usage Guidelines */}
        <div className="mt-12 bg-card border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Usage Guidelines</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Dashboard Buttons</h3>
              <p className="text-muted-foreground mb-2">
                Use text-only buttons with minimal hover effects for dashboard actions:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Primary actions: <code className="bg-muted px-1 rounded">text-gray-900 hover:text-gray-700 hover:underline</code></li>
                <li>Secondary actions: <code className="bg-muted px-1 rounded">text-gray-600 hover:text-gray-900 hover:underline</code></li>
                <li>No background colors, borders, or shadows</li>
                <li>Simple underline on hover</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Scope</h3>
              <p className="text-muted-foreground mb-2">
                These styles apply to <strong>APR Dashboard V3</strong> only. TDD and Report Builder pages maintain their own styling.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li><strong>Dashboard:</strong> Text-only buttons, minimal styling</li>
                <li><strong>TDD Pages:</strong> Keep existing styles (TestInputDashboard, etc.)</li>
                <li><strong>Report Builder:</strong> Keep existing styles (MockReportBuilder, DocumentBuilderTest)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
