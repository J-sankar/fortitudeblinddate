import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

/**
 * @param {Object} partner - The fetched profile of the matched partner
 * @param {string} template - The animation/style type ('minimal', 'cinematic', 'expressive')
 */
export default function Reveal({ partner, template }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    // Access the session passed from Chat.jsx
    const initialSession = location.state?.session;

    const [isActive, setIsActive] = useState(false);
    const [sessionData, setSessionData] = useState(initialSession);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!initialSession?.id) {
            navigate("/");
            return;
        }

        // 1. Initial Fetch to get the absolute latest state
        const fetchLatest = async () => {
            const { data } = await supabase
                .from("sessions")
                .select("*")
                .eq("id", initialSession.id)
                .single();
            if (data) setSessionData(data);
            setLoading(false);
        };
        fetchLatest();

        // 2. Real-time listener to "Snap" open when the partner agrees
        const channel = supabase
            .channel(`reveal-sync-${initialSession.id}`)
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'sessions',
                filter: `id=eq.${initialSession.id}`
            }, (payload) => {
                setSessionData(payload.new);
            })
            .subscribe();

        const timer = setTimeout(() => setIsActive(true), 100);

        return () => {
            clearTimeout(timer);
            supabase.removeChannel(channel);
        };
    }, [initialSession, navigate]);

    // Logic: Are we ready to reveal?
    const isUserA = user?.id === sessionData?.user_a;
    const bothAgreed = sessionData?.user_a_reveal && sessionData?.user_b_reveal;

    // Logic: Did the PARTNER choose to share their phone?
    const partnerSharedPhone = isUserA ? sessionData?.user_b_share_phone : sessionData?.user_a_share_phone;

    if (loading) return (
        <div className="h-screen bg-[#0c111f] flex items-center justify-center text-[#ed9e6f] font-mono uppercase tracking-widest animate-pulse">
            ✦ Synchronizing...
        </div>
    );

    // --- STATE 1: Waiting for partner ---
    if (!bothAgreed) {
        return (
            <div className="h-screen bg-[#0c111f] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 border-2 border-[#ed9e6f]/20 border-t-[#ed9e6f] rounded-full animate-spin mb-6" />
                <h2 className="text-xl text-[#ed9e6f] font-bold mb-2 tracking-tighter" style={{ fontFamily: "Satisfy, cursive" }}>
                    Waiting for the Echo...
                </h2>
                <p className="text-white/40 text-xs uppercase tracking-widest max-w-[200px]">
                    The connection is pending your partner's final choice.
                </p>
                <button onClick={() => navigate("/")} className="mt-12 text-white/20 text-[10px] uppercase tracking-[0.3em] border-b border-white/5 pb-1">
                    Abandon Reveal
                </button>
            </div>
        );
    }

    // Map the gender to the specific images you provided
    // Ensure these paths match your public folder or assets
    const templateImage = partner.gender === "Female"
        ? "/assets/female.png"
        : "/templates/male.png";

    return (
        <div className={`reveal-container ${template} ${isActive ? "active" : ""}`}>

            {/* 🎬 Cinematic Bars (Specific to Cinematic Template) */}
            {template === "cinematic" && (
                <>
                    <div className="cinema-bar top"></div>
                    <div className="cinema-bar bottom"></div>
                </>
            )}

            {/* 🎨 Liquid Drops (Specific to Expressive Template) */}
            {template === "expressive" && (
                <div className="ink-drops">
                    <div className="drop d1"></div>
                    <div className="drop d2"></div>
                </div>
            )}

            <div className="card-wrapper">
                <div className="identity-card">
                    {/* The Base Template Image based on Gender */}
                    <img
                        src={templateImage}
                        alt="Identity Template"
                        className="template-base"
                    />

                    {/* Dynamic Content Overlay */}
                    <div className="details-overlay">
                        {/* Minimalist vertical side-label */}
                        <div className="vertical-label">
                            STUDENT ✦ {partner.gender?.toUpperCase()}
                        </div>

                        <div className="info-block">
                            {/* Name Reveal */}
                            <h2 className="reveal-name">
                                {partner.full_name || "Secret User"}
                            </h2>

                            {/* Sub-details */}
                            <p className="reveal-meta text-[11px] font-bold text-black/40 uppercase tracking-[0.2em] mt-1">
                                {partner.year_of_study} • {partner.gender}
                            </p>

                            {/* Contact Information */}
                            {/* Contact Information */}
                            <div className="contact-box">
                                <p className="text-[9px] font-bold text-black/20 uppercase tracking-tighter mb-1">
                                    Contact Number
                                </p>
                                <span className="value">
                                    {/* ⭐ Logic: Only show phone if partner chose 'full' reveal */}
                                    {partnerSharedPhone
                                        ? (partner.phoneno || partner.phone || "No Number Shared")
                                        : "Identity Only"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Exit/Return button - optional but helpful */}
            <button
                onClick={() => navigate("/basic")}
                className="absolute bottom-10 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] uppercase tracking-widest hover:text-[#ed9e6f] hover:border-[#ed9e6f]/30 transition-all z-50"
            >
                Close Connection
            </button>



        </div>


    );



}

