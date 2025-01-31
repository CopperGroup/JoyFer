"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createuserByMyself, fetchUserByEmail } from "@/lib/actions/user.actions"
import { Plus } from "lucide-react"

export function AddClientButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState("")
  const [surname, setSurname] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = await fetchUserByEmail({ email }, 'json');

    const existingUser = JSON.parse(result);

    if(existingUser) {
      setError("Email already in use")
    }

    if(!name || !email) {
      setError("Name and email must be provided")
    }
    
    if(!error && name && email && !existingUser) {
      console.log("Adding client:", { name, surname, email, phone })

      const createdUser = await createuserByMyself({ name, email, surname, phoneNumber: phone}, "json")
  
      setName("")
      setSurname("")
      setEmail("")
      setPhone("")
      setIsOpen(false)
    }

  }

  return (
    <div className="w-full flex justify-end">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="default" className="text-base-semibold text-white">
            <Plus className="size-5 mr-1"/>
            Add Client
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-heading3-bold">Add New Client</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base-semibold">
                Name *
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => {setName(e.target.value), setError("")}}
                placeholder="Enter client name"
                required
                className="text-base-regular placeholder:text-subtle-medium"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="surname" className="text-base-semibold">
                Surname
              </Label>
              <Input
                id="surname"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                placeholder="Enter client surname (optional)"
                className="text-base-regular placeholder:text-subtle-medium"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base-semibold">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {setEmail(e.target.value), setError("")}}
                placeholder="Enter client email"
                required
                className="text-base-regular placeholder:text-subtle-medium"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-base-semibold">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter client phone number (optional)"
                className="text-base-regular placeholder:text-subtle-medium"
              />
            </div>
            <p className="text-small-medium text-red-500">{error}</p>
            <Button type="submit" className="w-full text-base-semibold text-white">
              Add Client
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

