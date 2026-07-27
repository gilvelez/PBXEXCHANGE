export const demoPeople = [
  { id: "maria", name: "Maria Santos", handle: "@mariasantos", initials: "MS", country: "United States", status: "Friend" },
  { id: "jose", name: "Jose Reyes", handle: "@josereyes", initials: "JR", country: "Philippines", status: "Connected" },
  { id: "ana", name: "Ana Cruz", handle: "@anacruz", initials: "AC", country: "Philippines", status: "Request pending" },
];

export const demoWallets = [
  { currency: "USD", label: "US Dollar wallet", balance: "$1,242.75", state: "Demo balance" },
  { currency: "PHP", label: "Philippine peso wallet", balance: "₱18,430.00", state: "Demo balance" },
  { currency: "USDC", label: "Digital dollar structure", balance: "$250.00", state: "Sandbox structure" },
];

export const demoConversation = [
  { id: "m1", from: "Jose", type: "text", text: "Hi Maria, can you send for groceries?", time: "9:40 AM" },
  { id: "r1", from: "Jose", type: "request", amount: "$45.00", note: "Sunday groceries", status: "Pending request", time: "9:42 AM" },
  { id: "p1", from: "Maria", type: "payment", amount: "$45.00", note: "For Sunday groceries", status: "Completed in demo", time: "9:44 AM" },
  { id: "m2", from: "Jose", type: "text", text: "Received. Salamat!", time: "9:45 AM" },
];

export const demoActivity = [
  { id: "a1", type: "Payment sent", title: "Jose Reyes", amount: "-$45.00", status: "Completed", time: "Today" },
  { id: "a2", type: "Request", title: "Ana Cruz", amount: "$28.00", status: "Pending", time: "Yesterday" },
  { id: "a3", type: "Conversion", title: "USD to PHP", amount: "₱5,620.00", status: "Illustrative rate", time: "Fri" },
  { id: "a4", type: "Deposit", title: "Linked bank sandbox", amount: "+$250.00", status: "Demo", time: "Thu" },
];

export const demoBusinesses = [
  { id: "b1", name: "Luzon Bakery", handle: "@luzonbakery", category: "Food & Dining", status: "Demo profile" },
  { id: "b2", name: "Bayanihan Tuition Center", handle: "@bayanihantutor", category: "Education", status: "Demo profile" },
  { id: "b3", name: "Manila Family Pharmacy", handle: "@mfp", category: "Health", status: "Demo profile" },
];

export const demoExternalRecipients = [
  { id: "e1", name: "Rosa Garcia", method: "GCash structure", status: "External settlement pending integration" },
  { id: "e2", name: "Miguel Santos", method: "Bank payout structure", status: "Sandbox recipient" },
];

export const demoSteps = [
  "Create your PBX identity",
  "Find family, friends, and businesses",
  "Connect and open a conversation",
  "Pay or request money in chat",
  "Manage USD, PHP, and digital-dollar wallet structures",
];

