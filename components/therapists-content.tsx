"use client"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit, MoreHorizontal, Plus, Search, Trash, User, ShieldAlert } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Sample therapist data
const therapists = [
  {
    id: "th-123456",
    name: "Dr. Sarah Johnson",
    specialty: "Anxiety, Depression",
    status: "Active",
    clients: 12,
    joinDate: "Jan 15, 2023",
  },
  {
    id: "th-234567",
    name: "Dr. Michael Chen",
    specialty: "Trauma, PTSD",
    status: "Active",
    clients: 8,
    joinDate: "Mar 22, 2023",
  },
  {
    id: "th-345678",
    name: "Dr. Emily Rodriguez",
    specialty: "Relationships, Family Therapy",
    status: "Active",
    clients: 15,
    joinDate: "Feb 10, 2023",
  },
  {
    id: "th-456789",
    name: "Dr. James Wilson",
    specialty: "Addiction, Recovery",
    status: "Inactive",
    clients: 5,
    joinDate: "Apr 5, 2023",
  },
  {
    id: "th-567890",
    name: "Dr. Lisa Thompson",
    specialty: "Grief, Loss",
    status: "Active",
    clients: 10,
    joinDate: "May 18, 2023",
  },
]

export function TherapistsContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const searchParams = useSearchParams()
  const isSuperAdmin = searchParams.get("role") === "superadmin"

  const filteredTherapists = therapists.filter(
    (therapist) =>
      therapist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      therapist.specialty.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <>
      <div className="flex items-center justify-end">
        <Link href={isSuperAdmin ? "/admin/therapists/new?role=superadmin" : "/admin/therapists/new"}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Therapist
          </Button>
        </Link>
      </div>

      {isSuperAdmin && (
        <Alert className="bg-primary/10 text-primary">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Super Admin Access</AlertTitle>
          <AlertDescription>
            As a Super Admin, you can add, edit, and delete therapist profiles without approval.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Therapist Directory</CardTitle>
          <CardDescription>View and manage all therapists on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search therapists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Specialty</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Clients</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTherapists.map((therapist) => (
                  <TableRow key={therapist.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{therapist.name}</p>
                          <p className="text-xs text-muted-foreground">{therapist.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{therapist.specialty}</TableCell>
                    <TableCell>
                      <Badge variant={therapist.status === "Active" ? "default" : "secondary"}>
                        {therapist.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{therapist.clients}</TableCell>
                    <TableCell>{therapist.joinDate}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          {isSuperAdmin && (
                            <>
                              <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                <span>Impersonate</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <ShieldAlert className="mr-2 h-4 w-4" />
                                <span>Verify Credentials</span>
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem className="text-destructive">
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
