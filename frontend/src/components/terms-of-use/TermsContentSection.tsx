type BulletSection = {
    subtitle: string;
    bullets: string[];
  };
  
  type ParagraphSection = {
    paragraph: string;
  };
  
  type TermsSection = {
    title: string;
    content: (BulletSection | ParagraphSection)[];
  };
  
  const termsSections: TermsSection[] = [
    {
      title: "Use Of The Platform",
      content: [
        {
          subtitle: "Eligibility",
          bullets: ["You must be at least 18 years old to use the Platform."],
        },
        {
          subtitle: "User Account",
          bullets: [
            "You agree to provide accurate and complete information when creating an account on the Platform.",
            "You are responsible for maintaining the confidentiality of your account credentials.",
          ],
        },
        {
          subtitle: "Prohibited Conduct",
          bullets: [
            "You shall not engage in any activity that disrupts or interferes with the proper functioning of the Platform.",
            "Prohibited conduct includes, but is not limited to, hacking, unauthorized access, or distribution of malicious software.",
          ],
        },
      ],
    },
    {
      title: "Intellectual Property",
      content: [
        {
          subtitle: "Ownership",
          bullets: [
            "The content, design, and functionality of the Platform are owned by Tobams Logic. You may not reproduce, distribute, or modify any part of the Platform without explicit permission.",
          ],
        },
        {
          subtitle: "User Content",
          bullets: [
            "By submitting content to the Platform, you grant Tobams Logic a non-exclusive, royalty-free, worldwide license to use, display, and distribute the content.",
          ],
        },
      ],
    },
    {
      title: "User Conduct",
      content: [
        {
          bullets: [
            "Users agree to use the platform responsibly and adhere to ethical conduct.",
            "Tobams Group Academy reserves the right to suspend or terminate accounts violating these terms.",
          ],
        } as BulletSection,
      ],
    },
    {
      title: "Modification",
      content: [
        {
          paragraph:
            "Tobams Group Academy may revise these terms at any time. Users are encouraged to review terms periodically for updates.",
        },
      ],
    },
  ];
  
  function isBulletSection(
    item: BulletSection | ParagraphSection
  ): item is BulletSection {
    return "bullets" in item;
  }
  
  export default function TermsContentSection() {
    return (
      <>
        {/* Main Terms Content */}
        <section className="py-12 px-6 md:px-16 lg:px-24">
          <div className="max-w-[720px] mx-auto flex flex-col gap-6 md:gap-10">
            {termsSections.map((section) => (
              <div key={section.title} className="flex flex-col gap-6">
                {/* Section title */}
                <h2 className="text-2xl md:text-[32px] font-semibold text-[#221D23]">
                  {section.title}
                </h2>
  
                {/* Content blocks */}
                <div className="flex flex-col gap-5">
                  {section.content.map((block, i) => (
                    <div key={i} className="flex flex-col gap-2">
                      {isBulletSection(block) ? (
                        <>
                          {block.subtitle && (
                            <h4 className="text-lg md:text-[20px] font-medium text-[#101828]">
                              {block.subtitle}
                            </h4>
                          )}
                          <ul className="flex flex-col gap-2">
                            {block.bullets.map((bullet, j) => (
                              <li
                                key={j}
                                className="flex items-start gap-2.5 text-[#474348] md:text-lg leading-relaxed"
                              >
                                <span className="mt-2 w-1 h-1 rounded-full bg-[#474348] flex-shrink-0" />
                                {bullet}
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : (
                        <p className="text-[#474348] md:text-lg leading-relaxed">
                          {block.paragraph}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
  
        {/* Contact Information footer block */}
        <section className="bg-[#EEF0F6] py-[47px] md:py-16 px-6 text-center">
          <div className="max-w-5xl mx-auto flex flex-col gap-1 md:gap-5">
            <h2 className="text-2xl md:text-3xl lg:text-[40px] font-semibold text-heading">
              Contact Information
            </h2>
            <p className="text-[#474348] md:text-[20px]">
              If you have any questions or concerns about these Terms and
              Conditions, please contact us at{" "}
              <a
                href="mailto:theteam@tobamsgroup.com"
                className="text-[#1671D9] hover:underline"
              >
                theteam@tobamsgroup.com
              </a>
            </p>
          </div>
        </section>
      </>
    );
  }