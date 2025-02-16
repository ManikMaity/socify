import { AlertDialogProps } from "@/config/interfaces"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"


function DeleteAlertDialog({
    isDeleting,
    onDelete,
    title = "Delete this item?",
    description = "Are you sure you want to delete this item?",
    children
} : AlertDialogProps) {
  return (
    <AlertDialog>
  <AlertDialogTrigger asChild>
    {
    children ? children : "Open"
    }
    </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>{title}</AlertDialogTitle>
      <AlertDialogDescription>
        {description}
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction
        disabled={isDeleting}
        onClick={onDelete}
      >Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
  )
}

export default DeleteAlertDialog
