'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AccessCodeForm from '@/components/AccessCodeForm';
import ReturnForm from '@/components/ReturnForm';
import ReturnSuccess from '@/components/ReturnSuccess';

export default function Page() {
  const [returnCode, setReturnCode] = useState(null);
  const [submitted, setSubmitted] = useState(null);

  return (
    <main className="page">
      <div className="flower f1">✿</div>
      <div className="flower f2">✿</div>
      <div className="flower f3">✿</div>

      <div className="wrap">
        <Header />

        {!returnCode && !submitted && (
          <AccessCodeForm onVerified={setReturnCode} />
        )}

        {returnCode && !submitted && (
          <ReturnForm
            returnCode={returnCode}
            onSubmitted={setSubmitted}
          />
        )}

        {submitted && (
          <ReturnSuccess request={submitted} />
        )}

        <Footer />
      </div>
    </main>
  );
}
