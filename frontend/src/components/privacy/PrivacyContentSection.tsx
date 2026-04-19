type BulletSection = {
    subtitle?: string;
    bullets: string[];
    ordered?: boolean;
  };
  
  type ParagraphSection = {
    paragraph: string;
  };
  
  type PrivacySection = {
    title: string;
    content: (BulletSection | ParagraphSection)[];
  };
  
  const privacySections: PrivacySection[] = [
    {
      title: "Personal Information",
      content: [
        {
          bullets: [
            "Tobams Group Academy collects personal information during the registration process.",
            "Information collected includes name, email, and other relevant details necessary for course delivery.",
          ],
          ordered: true,
        } as BulletSection,
      ],
    },
    {
      title: "Usage Information",
      content: [
        {
          bullets: [
            "Tobams Group Academy may collect data on user interaction with the platform for analytical purposes.",
            "This information is used to improve user experience and enhance course offerings.",
          ],
          ordered: true,
        } as BulletSection,
      ],
    },
    {
      title: "Security",
      content: [
        {
          bullets: [
            "Tobams Group Academy employs industry-standard security measures to protect user information.",
            "Personal information is encrypted and stored securely.",
          ],
          ordered: true,
        } as BulletSection,
      ],
    },
    {
      title: "Third-Party Services",
      content: [
        {
          bullets: [
            "Tobams Group Academy may use third-party services for analytics and payment processing.",
            "Users are encouraged to review the privacy policies of third-party services.",
          ],
          ordered: true,
        } as BulletSection,
      ],
    },
    {
      title: "Cookies",
      content: [
        {
          bullets: [
            "Tobams Group Academy uses cookies to enhance user experience.",
            "Users can manage cookie preferences through their browser settings.",
          ],
          ordered: true,
        } as BulletSection,
      ],
    },
    {
      title: "Communication",
      content: [
        {
          paragraph:
            "Tobams Group Academy may use provided email addresses for important communications related to courses and updates.",
        },
      ],
    },
  ];
  
  function isBulletSection(
    item: BulletSection | ParagraphSection
  ): item is BulletSection {
    return "bullets" in item;
  }
  
  export default function PrivacyContentSection() {
    return (
      <>
        {/* Main Privacy Content */}
        <section className="py-12 px-6 md:px-16 lg:px-24">
          <div className="max-w-[720px] mx-auto flex flex-col gap-6 md:gap-10">
            {privacySections.map((section) => (
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
                          {block.ordered ? (
                            <ol className="flex flex-col gap-2 list-decimal pl-5">
                              {block.bullets.map((bullet, j) => (
                                <li
                                  key={j}
                                  className="text-[#474348] md:text-lg leading-relaxed"
                                >
                                  {bullet}
                                </li>
                              ))}
                            </ol>
                          ) : (
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
                          )}
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