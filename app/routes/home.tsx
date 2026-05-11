import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard, {type Resume} from "~/components/ResumeCard";
import {Link, useLocation, useNavigate} from "react-router-dom";
import { resumes } from "../../constants";
import {usePuterStore} from "~/lib/puter";
import {useEffect} from "react"; // or correct path






export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumatch" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
    const {auth} = usePuterStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth?.isAuthenticated) {
            navigate('/auth?next=/');
        }
    }, [auth.isAuthenticated]);

  return <main className={"bg-[url('/images/bg-main.svg')] bg-cover"}>
    <Navbar/>
    <section className="main-section">
        <div className ="page-heading py-16">
            <h1>Track Your Applications & Resume Ratings</h1>
            <h2>Review your submissions and check AI-powered feedback.</h2>
        </div>


      {resumes.length > 0 && (
          <div className = "resume-section">
              {resumes.map((resume) => (
                  <ResumeCard key={resume.id} resume={resume as Resume} />
              ))}
          </div>
      )}
    </section>

  </main>;
}
