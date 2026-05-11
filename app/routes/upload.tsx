import React, { useState } from "react";
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import { usePuterStore } from "~/lib/puter";
import { useNavigate } from "react-router-dom";
import { convertPdfToImage } from "~/lib/pdf2img";
import { generateUUID } from "~/lib/utils";
import { prepareInstructions } from "../../constants";

const Upload = () => {
    const { fs, ai, kv } = usePuterStore();

    const navigate = useNavigate();

    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file);
    };

    const handleAnalyze = async ({
                                     companyName,
                                     jobTitle,
                                     jobDescription,
                                     file,
                                 }: {
        companyName: string;
        jobTitle: string;
        jobDescription: string;
        file: File;
    }) => {
        try {
            setIsProcessing(true);

            // Upload PDF
            setStatusText("Uploading resume...");
            const uploadedFile = await fs.upload([file]);

            if (!uploadedFile) {
                setStatusText("Error uploading resume");
                return;
            }

            // Convert PDF to image
            setStatusText("Converting PDF...");
            const imageFile = await convertPdfToImage(file);

            if (!imageFile) {
                setStatusText("Error converting PDF");
                return;
            }

            // Upload image
            setStatusText("Uploading image...");
            const uploadedImage = await fs.upload([
                imageFile.file ?? file,
            ]);

            if (!uploadedImage) {
                setStatusText("Error uploading image");
                return;
            }

            // Create ID
            const uuid = generateUUID();

            // Save initial data
            const data: any = {
                id: uuid,
                resumePath: uploadedFile.path,
                imagePath: uploadedImage.path,
                companyName,
                jobTitle,
                jobDescription,
                feedback: {},
            };

            await kv.set(`resume:${uuid}`, JSON.stringify(data));

            // Analyze Resume
            setStatusText("Analyzing resume...");

            const feedback = await ai.feedback(
                uploadedFile.path,
                prepareInstructions({
                    jobTitle,
                    jobDescription,
                    AIResponseFormat: "JSON",
                })
            );

            if (!feedback) {
                setStatusText("Failed to analyze resume");
                return;
            }

            // Save feedback directly
            data.feedback = feedback;

            console.log("FINAL FEEDBACK:", feedback);

            // Save final data
            await kv.set(`resume:${uuid}`, JSON.stringify(data));

            setStatusText("Analysis complete!");

            // Redirect
            navigate(`/resume/${uuid}`);
        } catch (err) {
            console.error("FULL ERROR:", err);
            setStatusText("Something went wrong");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSubmit = (
        e: React.SyntheticEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        const form = e.currentTarget;

        const formData = new FormData(form);

        const companyName = formData.get(
            "company-name"
        ) as string;

        const jobTitle = formData.get(
            "job-title"
        ) as string;

        const jobDescription = formData.get(
            "job-description"
        ) as string;

        if (!file) return;

        handleAnalyze({
            companyName,
            jobTitle,
            jobDescription,
            file,
        });
    };

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />

            <section className="main-section">
                <div className="page-heading py-5 px-8 text-[0.25xl]">
                    <h1>Smart Feedback For Your Dream Job</h1>

                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>

                            <img
                                src="/images/resume-scan.gif"
                                className="w-full"
                                alt="Scanning"
                            />
                        </>
                    ) : (
                        <h2>
                            Drop your resume for an ATS score
                            and improvement tips
                        </h2>
                    )}

                    {!isProcessing && (
                        <form
                            id="upload-form"
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-4 mt-5"
                        >
                            <div className="form-div">
                                <label htmlFor="company-name">
                                    Company Name
                                </label>

                                <input
                                    type="text"
                                    name="company-name"
                                    placeholder="Company Name"
                                    id="company-name"
                                />
                            </div>

                            <div className="form-div">
                                <label htmlFor="job-title">
                                    Job Title
                                </label>

                                <input
                                    type="text"
                                    name="job-title"
                                    placeholder="Job Title"
                                    id="job-title"
                                />
                            </div>

                            <div className="form-div">
                                <label htmlFor="job-description">
                                    Job Description
                                </label>

                                <textarea
                                    rows={5}
                                    name="job-description"
                                    placeholder="Job Description"
                                    id="job-description"
                                />
                            </div>

                            <div className="form-div">
                                <label htmlFor="uploader">
                                    Upload Resume
                                </label>

                                <FileUploader
                                    onFileSelect={handleFileSelect}
                                />
                            </div>

                            <button
                                className="primary-button"
                                type="submit"
                            >
                                Analyze Resume
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    );
};

export default Upload;