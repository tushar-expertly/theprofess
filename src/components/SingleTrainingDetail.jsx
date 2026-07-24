import { useEffect, useState } from "react";
import {
  CalendarDaysIcon,
  ClockIcon,
  PencilSquareIcon,
  UserCircleIcon,
  ChevronDownIcon,
  ShoppingCartIcon,
  SparklesIcon,
  VideoCameraIcon,
  ArchiveBoxIcon,
  GiftIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import Layout from "./layout";
import { useParams } from "react-router-dom";
import { useCoursesContext } from "../context/courses_context";
import { Link } from "react-router-dom";
import { useCartContext } from "../context/cart_context";
import { Oval } from "react-loader-spinner";
import parse from "html-react-parser";

const SectionCard = ({ title, children, accent = "teal" }) => {
  const accentMap = {
    teal: "border-teal-500 bg-teal-50/60 text-teal-800",
    amber: "border-amber-500 bg-amber-50/60 text-amber-900",
    violet: "border-violet-500 bg-violet-50/60 text-violet-900",
    rose: "border-rose-500 bg-rose-50/60 text-rose-900",
    slate: "border-slate-400 bg-slate-50/60 text-slate-800",
    emerald: "border-emerald-500 bg-emerald-50/60 text-emerald-900",
  };

  return (
    <article className="group rounded-2xl border border-stone-200/80 bg-white p-6 shadow-sm shadow-stone-200/50 transition-all duration-300 hover:border-stone-300 hover:shadow-md hover:shadow-stone-200/60 sm:p-8">
      <div
        className={`mb-4 inline-flex items-center rounded-full border-l-4 px-4 py-1.5 text-sm font-semibold tracking-wide ${accentMap[accent]}`}
      >
        {title}
      </div>
      <div className="prose prose-stone max-w-none text-[15px] leading-relaxed text-stone-600 prose-p:my-2 prose-ul:my-2 prose-li:my-0.5">
        {children}
      </div>
    </article>
  );
};

const PricingOption = ({ pricing, isChecked, onToggle }) => (
  <label
    className={`group flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3.5 transition-all duration-200 ${
      isChecked
        ? "border-teal-400 bg-teal-50/80 shadow-sm shadow-teal-100"
        : "border-stone-200 bg-stone-50/50 hover:border-stone-300 hover:bg-white"
    }`}
  >
    <div className="flex items-center gap-3">
      <div className="relative flex-shrink-0">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={onToggle}
          className="peer sr-only"
        />
        <div
          className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all duration-200 ${
            isChecked
              ? "border-teal-600 bg-teal-600"
              : "border-stone-300 bg-white group-hover:border-teal-400"
          }`}
        >
          {isChecked && (
            <CheckIcon className="h-3.5 w-3.5 text-white" strokeWidth={3} />
          )}
        </div>
      </div>
      <span
        className={`text-sm font-medium sm:text-[15px] ${
          isChecked ? "text-teal-900" : "text-stone-700"
        }`}
      >
        {pricing.sessionType}
      </span>
    </div>
    <span
      className={`ml-3 flex-shrink-0 text-sm font-bold tabular-nums sm:text-base ${
        isChecked ? "text-teal-700" : "text-stone-800"
      }`}
    >
      ${pricing.price}
    </span>
  </label>
);

const PricingSectionHeader = ({ icon: Icon, title, variant = "default" }) => {
  const styles = {
    default: "from-teal-600 to-emerald-600",
    live: "from-orange-500 to-amber-500",
    ondemand: "from-violet-600 to-purple-600",
    value: "from-rose-500 to-pink-600",
    access: "from-slate-600 to-stone-700",
  };

  return (
    <div className="mb-3 flex items-center gap-2.5">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${styles[variant]} text-white shadow-sm`}
      >
        <Icon className="h-4 w-4" />
      </div>
      <h3 className="text-base font-bold tracking-tight text-stone-800">
        {title}
      </h3>
    </div>
  );
};

const PriceSummary = ({ totalPrice, selectedCount }) => (
  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 p-6 text-center">
    <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-teal-500/10 blur-2xl" />
    <div className="pointer-events-none absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-amber-500/10 blur-2xl" />
    <p className="text-sm font-medium text-stone-400 line-through">
      Was: $
      {totalPrice != null && totalPrice > 0
        ? (totalPrice + selectedCount * 49).toFixed(2)
        : "00.00"}
    </p>
    <p className="mt-1 bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
      ${totalPrice != null && totalPrice > 0 ? totalPrice.toFixed(2) : "00.00"}
    </p>
    {selectedCount > 0 && (
      <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-300">
        <SparklesIcon className="h-3.5 w-3.5" />
        You Save: ${selectedCount * 49}
      </div>
    )}
  </div>
);

const AddToCartButton = ({ disabled, onClick }) => (
  <Link
    to={disabled ? "#" : "/cart"}
    className={`group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl py-3.5 px-5 text-base font-semibold transition-all duration-300 ${
      disabled
        ? "cursor-not-allowed bg-stone-300 text-stone-500 pointer-events-none"
        : "bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-600/25 hover:from-teal-500 hover:to-emerald-500 hover:shadow-teal-500/30 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 active:scale-[0.98]"
    }`}
    onClick={onClick}
  >
    <ShoppingCartIcon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
    Add to Cart
  </Link>
);

const SingleTrainingDetail = () => {
  const { id } = useParams();
  const { fetchSingleCourse, single_course } = useCoursesContext();
  const { addToCart } = useCartContext();
  const [loading, setLoading] = useState(true);
  const [selectedPricings, setSelectedPricings] = useState([]);
  // const [openInfoId, setOpenInfoId] = useState(null);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await fetchSingleCourse(id);
      setLoading(false);
    };
    fetchData();
  }, [id, fetchSingleCourse]);

  // useEffect(() => {
  //   if (single_course?.Pricings?.length) {
  //     setSelectedPricings([single_course.Pricings[0]]);
  //   }
  // }, [single_course]);
  useEffect(() => {
    if (single_course?.Pricings?.length) {
      const isPastWebinar = new Date(single_course.webinarDate) < new Date();

      if (isPastWebinar) {
        const accessOptions = single_course.Pricings.filter(
          (pricing) =>
            pricing.sessionType === "Recorded session" ||
            pricing.sessionType === "Transcript" ||
            pricing.sessionType === "Recorded Plus Transcript session",
        );

        if (accessOptions.length > 0) {
          setSelectedPricings([accessOptions[0]]); // ✅ select first valid option
        }
      } else {
        setSelectedPricings([single_course.Pricings[0]]); // ✅ original behavior
      }
    }
  }, [single_course]);
  const handlePricingToggle = (pricing) => {
    setSelectedPricings((prev) => {
      const exists = prev.find((p) => p.id === pricing.id);

      if (exists) {
        return prev.filter((p) => p.id !== pricing.id);
      } else {
        return [...prev, pricing];
      }
    });
  };
  const totalPrice = selectedPricings.reduce(
    (sum, item) => sum + parseFloat(item.price),
    0,
  );

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-gradient-to-br from-stone-50 via-teal-50/30 to-amber-50/20">
        <Oval
          height={50}
          width={50}
          color="#0d9488"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="#14b8a6"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
        <p className="text-sm font-medium tracking-wide text-stone-500 animate-pulse">
          Loading webinar details…
        </p>
      </div>
    );
  }

  const {
    courseID,
    title,
    instructor,
    // duration,
    // price,
    discountedPrice,
    description,
    what_you_will_learn,
    // content,
    imageSrc,
    Pricings = [],
    webinarDate,
    duration,
    areas_covered,
    who_will_benefit,
    instructor_profile,
    why_register,
    background,
    // target_companies,
    // target_association,
  } = single_course;
  console.log("🚀 ~ SingleTrainingDetail ~ Pricings:", Pricings);

  const dateTime = new Date(webinarDate);

  const webinarDateUTC = new Date(webinarDate);
  const isPastWebinar = new Date(webinarDate) < new Date();
  const accessOptions = Pricings.filter(
    (pricing) =>
      pricing.sessionType === "Recorded session" ||
      pricing.sessionType === "Transcript" ||
      pricing.sessionType === "Recorded Plus Transcript session",
  );

  const day = webinarDateUTC.getUTCDate();
  const monthYear = webinarDateUTC.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const weekday = webinarDateUTC.toLocaleString("en-US", {
    weekday: "long",
    timeZone: "UTC",
  });
  const formattedTimeEST = dateTime.toLocaleString("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const formattedTimePST = dateTime.toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  function convertMinutes(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (minutes <= 60) {
      return `${minutes} min`;
    }

    return `${hours} hour${hours > 1 ? "s" : ""} ${remainingMinutes} min`;
  }
  const visiblePricings = showMore
    ? Pricings.slice(0, 5)
    : Pricings.slice(0, 2);

  const handleAddToCart = (e) => {
    if (selectedPricings.length === 0) {
      e.preventDefault();
      return;
    }
    addToCart(
      courseID,
      imageSrc,
      title,
      instructor,
      selectedPricings.length > 0 ? totalPrice : discountedPrice,
      selectedPricings,
    );
  };

  const contentSections = [
    {
      key: "description",
      title: "Description",
      content: description,
      accent: "teal",
    },
    {
      key: "why_register",
      title: "Why Register",
      content: why_register,
      accent: "amber",
    },
    {
      key: "what_you_will_learn",
      title: "Why Should You Attend",
      content: what_you_will_learn,
      accent: "violet",
    },
    {
      key: "areas_covered",
      title: "Areas Covered in the Webinar Session",
      content: areas_covered,
      accent: "emerald",
    },
    {
      key: "who_will_benefit",
      title: "Who will benefit?",
      content: who_will_benefit,
      accent: "rose",
    },
    {
      key: "instructor_profile",
      title: "Instructor Profile",
      content: instructor_profile,
      accent: "slate",
    },
    {
      key: "background",
      title: "Background",
      content: background,
      accent: "teal",
    },
  ].filter((section) => section.content);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-stone-100 via-stone-50 to-teal-50/20">
        {/* Hero Banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-teal-900">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.18),_transparent_40%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,18,22,0.94)_0%,rgba(12,18,22,0.78)_45%,rgba(12,18,22,0.6)_100%)]" />

          <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
            <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="max-w-3xl animate-[fadeIn_0.6s_ease-out]">
                <span
                  className={`mb-4 inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold uppercase tracking-widest ${
                    isPastWebinar
                      ? "bg-stone-500/20 text-stone-300 ring-1 ring-stone-400/30"
                      : "bg-teal-500/20 text-teal-300 ring-1 ring-teal-400/30"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${isPastWebinar ? "bg-stone-400" : "bg-teal-400 animate-pulse"}`}
                  />
                  {isPastWebinar ? "On-Demand Access" : "Live Webinar"}
                </span>
                <h1 className="text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl xl:text-[2.75rem] xl:leading-[1.15]">
                  {title}
                </h1>
                <p className="mt-4 flex items-center gap-2 text-sm text-stone-300 sm:text-base">
                  <UserCircleIcon className="h-5 w-5 flex-shrink-0 text-teal-400" />
                  <span>
                    Led by{" "}
                    <span className="font-semibold text-white">
                      {instructor?.replace(/"/g, "")}
                    </span>
                  </span>
                </p>
              </div>

              {imageSrc && (
                <div className="flex justify-center lg:justify-end">
                  <div className="w-full max-w-[220px] rounded-2xl border border-white/10 bg-white/5 p-2 shadow-lg backdrop-blur-md">
                    <div className="flex h-[180px] items-center justify-center overflow-hidden rounded-xl">
                      <img
                        src={imageSrc}
                        alt={title}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Meta Info Strip */}
        <div className="relative z-10 mx-auto -mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            <div className="flex items-center gap-4 rounded-2xl border border-stone-200/80 bg-white/95 p-5 shadow-lg shadow-stone-200/40 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-0.5">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-md shadow-teal-500/20">
                <CalendarDaysIcon className="h-7 w-7" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                  Date
                </p>
                <p className="text-lg font-bold text-stone-800">
                  {weekday}, {monthYear.split(" ")[0]} {day}
                </p>
                <p className="mt-0.5 text-xs text-stone-500">
                  {formattedTimeEST} EST · {formattedTimePST} PST
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-stone-200/80 bg-white/95 p-5 shadow-lg shadow-stone-200/40 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-0.5">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/20">
                <ClockIcon className="h-7 w-7" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                  Duration
                </p>
                <p className="text-lg font-bold text-stone-800">
                  {duration ? convertMinutes(duration) : "—"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-stone-200/80 bg-white/95 p-5 shadow-lg shadow-stone-200/40 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-0.5">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md shadow-violet-500/20">
                <PencilSquareIcon className="h-7 w-7" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                  Instructor
                </p>
                <p className="truncate text-lg font-bold text-stone-800">
                  {instructor?.replace(/"/g, "")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Left — Content Sections */}
            <div className="space-y-5 lg:col-span-7 xl:col-span-8">
              {contentSections.map((section, index) => (
                <div
                  key={section.key}
                  className="animate-[fadeInUp_0.5s_ease-out_both]"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <SectionCard title={section.title} accent={section.accent}>
                    {parse(section.content)}
                  </SectionCard>
                </div>
              ))}
            </div>

            {/* Right — Pricing Sidebar */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="sticky top-6 space-y-5">
                {isPastWebinar ? (
                  <div className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white/90 p-6 shadow-xl shadow-stone-200/50 backdrop-blur-md sm:p-7">
                    <PriceSummary
                      totalPrice={totalPrice}
                      selectedCount={selectedPricings.length}
                    />

                    <div className="mt-5">
                      <AddToCartButton
                        disabled={selectedPricings.length === 0}
                        onClick={handleAddToCart}
                      />
                    </div>

                    <div className="mt-6 border-t border-stone-100 pt-5">
                      <PricingSectionHeader
                        icon={ArchiveBoxIcon}
                        title="Access Options"
                        variant="access"
                      />
                      <div className="space-y-2">
                        {accessOptions.map((pricing) => {
                          const isChecked = selectedPricings.some(
                            (p) => p.id === pricing.id,
                          );

                          return (
                            <PricingOption
                              key={pricing.id}
                              pricing={pricing}
                              isChecked={isChecked}
                              onToggle={() => handlePricingToggle(pricing)}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-3xl border border-stone-200/80 bg-white/90 p-6 shadow-xl shadow-stone-200/50 backdrop-blur-md sm:p-7">
                    <PriceSummary
                      totalPrice={totalPrice}
                      selectedCount={selectedPricings.length}
                    />

                    <div className="mt-5">
                      <AddToCartButton
                        disabled={selectedPricings.length === 0}
                        onClick={handleAddToCart}
                      />
                    </div>

                    <div className="mt-6 space-y-5">
                      <div>
                        <PricingSectionHeader
                          icon={VideoCameraIcon}
                          title="Live Webinar"
                          variant="live"
                        />
                        <div className="space-y-2">
                          {visiblePricings.map((pricing) => {
                            const isChecked = selectedPricings.some(
                              (p) => p.id === pricing.id,
                            );

                            // const isInfoOpen = openInfoId === pricing.id;

                            return (
                              <div
                                key={pricing.id}
                                className="overflow-hidden rounded-xl transition-all"
                              >
                                <PricingOption
                                  pricing={pricing}
                                  isChecked={isChecked}
                                  onToggle={() => handlePricingToggle(pricing)}
                                />

                                {/* <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenInfoId(isInfoOpen ? null : pricing.id);
                        }}
                        className="w-5 h-5 flex items-center justify-center rounded-full border text-blue-600 text-xs font-bold hover:bg-blue-50"
                      >
                        i
                      </button> */}

                                {/* <div
                      className={`transition-all duration-300 ease-in-out ${
                        isInfoOpen
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                      } overflow-hidden border-t`}
                    >
                      <ul className="text-sm text-gray-700 p-4 space-y-2 list-disc list-inside bg-gray-50">
                        <li>Access Credentials will be shared via email</li>
                        <li>
                          Credentials available the day before or day of the
                          webinar
                        </li>
                        <li>Add/Edit attendees from My Account</li>
                        <li>Certificate of Participation provided</li>
                      </ul>
                    </div> */}
                              </div>
                            );
                          })}
                        </div>

                        {Pricings.length > 2 && (
                          <button
                            onClick={() => setShowMore(!showMore)}
                            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold text-teal-700 transition-colors hover:bg-teal-50 hover:text-teal-800"
                          >
                            <span>
                              {showMore ? "Less Attendees" : "More Attendees"}
                            </span>
                            <ChevronDownIcon
                              className={`h-4 w-4 transition-transform duration-300 ${
                                showMore ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        )}
                      </div>

                      {/* <div>
              <h3 className="font-semibold text-center text-blue-700 text-lg mb-3 border border-blue-300 bg-[#f9f9f9] px-4 py-2">
                Live Webinar
              </h3>

              {Pricings?.slice(0, 5).map((pricing) => {
                const isChecked = selectedPricings.some(
                  (p) => p.id === pricing.id
                );

                return (
                  <label
                    key={pricing.id}
                    className="flex items-center justify-between border p-3 rounded-md mt-2 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handlePricingToggle(pricing)}
                      />
                      <span>
                        {pricing.sessionType} - ${pricing.price}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div> */}

                      <div>
                        <PricingSectionHeader
                          icon={ArchiveBoxIcon}
                          title="On-Demand"
                          variant="ondemand"
                        />
                        <div className="space-y-2">
                          {Pricings?.filter(
                            (pricing) =>
                              pricing.sessionType === "Recorded session" ||
                              pricing.sessionType === "Transcript",
                          ).map((pricing) => {
                            const isChecked = selectedPricings.some(
                              (p) => p.id === pricing.id,
                            );

                            return (
                              <PricingOption
                                key={pricing.id}
                                pricing={pricing}
                                isChecked={isChecked}
                                onToggle={() => handlePricingToggle(pricing)}
                              />
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <PricingSectionHeader
                          icon={GiftIcon}
                          title="Value Packs"
                          variant="value"
                        />
                        <div className="space-y-2">
                          {Pricings?.filter(
                            (pricing) =>
                              pricing.sessionType ===
                                "Live Plus Recorded session" ||
                              pricing.sessionType ===
                                "Live Plus Transcript session" ||
                              pricing.sessionType ===
                                "Recorded Plus Transcript session" ||
                              pricing.sessionType ===
                                "Group Session For 10 Attendees" ||
                              pricing.sessionType ===
                                "Group Session For More Than 10 Attendees",
                          ).map((pricing) => {
                            const isChecked = selectedPricings.some(
                              (p) => p.id === pricing.id,
                            );

                            return (
                              <PricingOption
                                key={pricing.id}
                                pricing={pricing}
                                isChecked={isChecked}
                                onToggle={() => handlePricingToggle(pricing)}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Layout>
  );
};

export default SingleTrainingDetail;
