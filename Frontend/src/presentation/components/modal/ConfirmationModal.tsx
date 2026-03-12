import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog'
import { AlertCircle,Ban, Info } from 'lucide-react'
import { cn } from '../../../lib/utils'


interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info'
}

const ConfirmationModal: React.FC<ConfirmationModalProps>= ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm Action',
  cancelText = 'Cancel',
  type = 'warning'
}) => {

  const typeConfig = {
    danger: {
      icon: Ban,
      color: 'text-red-600',
      bg: 'bg-red-50',
      button: 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-200'
    },
    warning: {
      icon: AlertCircle,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      button: 'bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-200'
    },
    info: {
      icon: Info,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      button: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200'
    }
  }

  const config = typeConfig[type]
  const Icon = config.icon

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>

      <AlertDialogContent className='sm:max-w-[440px] border-none'>

        <AlertDialogHeader>

          <div className='flex items-center gap-4 mb-2'>
            <div className={cn("p-3 rounded-2xl", config.bg)}>
              <Icon className={cn("w-6 h-6", config.color)}/>
            </div>
            <AlertDialogTitle className='text-2xl'>{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className='mt-8 gap-3 sm:gap-0'>

          <AlertDialogCancel onClick={onClose} className="rounded-2xl h-12 border-gray-100 bg-gray-50/50 hover:bg-gray-100 transition-all font-bold">
             {cancelText}
          </AlertDialogCancel>

          <AlertDialogAction 
               onClick={onConfirm}
               className={cn("rounded-2xl h-12 font-bold transition-all active:scale-95", config.button)}
          >
              {confirmText}
          </AlertDialogAction>

        </AlertDialogFooter>

      </AlertDialogContent>

    </AlertDialog>
  )
}

export default ConfirmationModal
