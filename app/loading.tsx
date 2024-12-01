import { SpinnerIcon } from '@/components/SpinnerIcon';
export default function Loading() {
  return <div className="pointer-events-auto fixed inset-0 top-0 left-0 h-full w-full bg-black bg-opacity-20 opacity-100 backdrop-blur-sm">
    <div aria-label="loading..." className="fixed z-[9995] top-0 left-0 h-full w-full animate-spin">
      <SpinnerIcon aria-hidden="true" width={32} height={32} className="absolute top-1/2 left-1/2 -ml-4 -mt-4 text-gray" />
    </div>
  </div>
}