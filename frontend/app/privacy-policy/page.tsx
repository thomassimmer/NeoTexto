"use client";

import { SignInModal } from "@/components/auth/sign-in-modal";
import Footer from "@/components/footer";
import { ContactModal } from "@/components/home/contact-modal";
import Navbar from "@/components/navbar";
import { HelpDialog } from "@/components/shared/help-dialog";
import { IntroductionDialog } from "@/components/shared/introduction-dialog";
import ToastMessage from "@/components/ui/toast";
import Link from "next/link";
import { useModalContext } from "../providers/modal-provider";

export default function PrivacyPolicy() {
  const { setShowContactModal } = useModalContext();

  return (
    <>
      <ContactModal />
      <SignInModal />
      <ToastMessage />
      <IntroductionDialog />
      <HelpDialog />
      <Navbar />
      <main className="relative top-16 flex min-h-[calc(100vh-4rem)] items-baseline justify-center">
        <section className="flex flex-col gap-y-2 p-10 text-justify text-sm sm:text-base md:w-2/3">
          <h2 className="text-2xl font-bold">Privacy Policy</h2>
          <p>
            NeoTexto.com (“NeoTexto”, “we” or “us”) is committed to protecting
            your privacy. This Privacy Policy explains the methods and reasons
            we collect, use, disclose, transfer, and store your information. If
            you have any questions about the contents of this policy, don’t
            hesitate to contact us.
          </p>
          <p>
            If you do not consent to the collection and use of information from
            or about you in accordance with this Privacy Policy, then you are
            not permitted to use NeoTexto or any services provided on&nbsp;
            <Link
              className="mx-1 font-bold text-gray-800 transition-colors hover:underline"
              href="/"
              rel="noopener noreferrer"
            >
              https://neotexto.com
            </Link>
            .
          </p>
          <h3 className="text-xl font-bold">Applicable Law</h3>
          <p>
            NeoTexto is headquartered in Paris, France. By viewing any content
            or otherwise using the services offered by NeoTexto, you consent to
            the transfer of information to the European Union to the extent
            applicable, and the collection, storage, and processing of
            information under European Union law.
          </p>
          <h3 className="text-xl font-bold">Information We Collect</h3>
          <p>
            Information you submit: We store information you provide on this
            site via forms, surveys, or any other interactive content. This
            information includes your email address, your mother tongue, your
            uploaded profile pictures, your texts and your list of vocabulary.
          </p>
          <p>
            <strong>Log Files</strong>: We collect information when you use
            services provided on our site. This information may include your IP
            address, device and software characteristics (such as type and
            operating system), page views, referral URLs, device identifiers or
            other unique identifiers such as advertising identifiers (e.g.,
            “ad-ID” or “IDFA”), and carrier information. Log files are primarily
            used for the purpose of enhancing the user experience.
          </p>
          <p>
            <strong>Cookies</strong>: We use cookies and related technologies
            only for authentication. Cookies are small text files created by a
            web server, delivered through a web browser, and stored on your
            computer. Most Internet browsers automatically accept cookies. You
            can instruct your browser, by changing its settings, to stop
            accepting cookies or to prompt you before accepting a cookie from
            the websites you visit. When you connect to NeoTexto.com, a cookie
            will be stored on your computer so you do not have to re-enter it
            repeatedly during that session.
          </p>
          <h3 className="text-xl font-bold">Third Party Services</h3>
          <p>
            This site contains links to other websites not owned by NeoTexto. In
            general, the third-party services used by us will only collect, use
            and disclose your information to the extent necessary to allow them
            to perform their intended services. This informations includes
            languages, texts and list of vocabulary. Please be aware that we are
            not responsible for the privacy policies of third-party services.
          </p>
          <h3 className="text-xl font-bold">Contact Us</h3>
          <p>
            At NeoTexto, we believe our talented customer service staff will be
            able to resolve any issues you may have using our services. If you
            would like additional information about this privacy policy, please
            <Link
              className="mx-1 font-bold text-gray-800 transition-colors hover:underline"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowContactModal(true);
              }}
              rel="noopener noreferrer"
            >
              contact us
            </Link>
            .
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
