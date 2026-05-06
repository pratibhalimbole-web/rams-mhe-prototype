Samajh gaya 👍
Tum chahte ho:

1. **User clicks → Save Rack Status**
2. **Confirmation modal opens**
3. **User clicks Confirm**
4. **Status save hota hai**
5. **Sonner toast show hota hai**

Ye correct SaaS interaction hai.

---

# Correct Flow

```text
Select Status
      ↓
Save Rack Status
      ↓
Confirmation Modal
      ↓
Confirm
      ↓
Status Saved
      ↓
Sonner Toast
```

---

# 1. State Setup

```tsx
const [rackStatus, setRackStatus] = useState<
  "stable" | "conditional" | "not-stable" | null
>(null);

const [confirmOpen, setConfirmOpen] = useState(false);
```

---

# 2. Save Button

Bottom panel button:

```tsx
<Button
  disabled={!rackStatus}
  onClick={() => setConfirmOpen(true)}
>
  Save Rack Status
</Button>
```

---

# 3. Confirmation Modal

Example with shadcn dialog.

```tsx
<Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
  <DialogContent>

    <DialogHeader>
      <DialogTitle>Confirm Rack Status</DialogTitle>
      <DialogDescription>
        You are about to mark this rack as <b>{rackStatus}</b>.
        Do you want to continue?
      </DialogDescription>
    </DialogHeader>

    <div className="flex justify-end gap-2 mt-4">

      <Button
        variant="outline"
        onClick={() => setConfirmOpen(false)}
      >
        Cancel
      </Button>

      <Button onClick={handleConfirmSave}>
        Confirm
      </Button>

    </div>

  </DialogContent>
</Dialog>
```

---

# 4. Save Handler + Sonner

```tsx
import { toast } from "sonner";

const handleConfirmSave = () => {

  setConfirmOpen(false);

  // simulate API save
  console.log("Saving rack status:", rackStatus);

  toast.success("Rack status saved successfully");
};
```

---

# 5. Resulting UX

User experience:

```
Save Rack Status
       ↓
Confirm Rack Status modal
       ↓
Confirm
       ↓
✔ Rack status saved successfully (Sonner)
```

---

# Optional (Better Message)

Dynamic message:

```tsx
toast.success(`Rack marked as ${rackStatus}`);
```

Example toast:

```
✔ Rack marked as Not Stable
```

---

# Final UX

Bottom panel:

```
Set Final Rack Status
[ Stable ] [ Conditional ] [ Not Stable ]

Cancel        Save Rack Status
```

Confirm modal:

```
Confirm Rack Status
You are marking this rack as Not Stable

Cancel      Confirm
```

Toast:

```
✔ Rack marked as Not Stable
```

---

If you want, I can also show **one improvement that will make this page feel much more like a professional warehouse inspection tool** (very small UI change but big UX improvement).
