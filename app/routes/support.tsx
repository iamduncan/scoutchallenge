import { AppLayout } from '~/layouts';

export default function SupportPage() {
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-6xl font-bold mb-6">
          <span role="img" aria-label="support">
            💡
          </span>
        </h1>
        <p className="text-xl">
          We are working hard to make this site better.
        </p>
        <p className="text-xl">
          If you have any questions, please contact us at{' '}
          <a href="mailto:support@scoutchallenge.app" className="text-blue-500">
            support@scoutchallenge.app
          </a>
        </p>
      </div>
    </AppLayout>
  )
}