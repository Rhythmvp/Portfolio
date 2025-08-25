export type PageContent = {
  hero: {
    title: string;
    subtitle: string;
    bio: string;
  };
  skills: {
    title: string;
    description: string;
    skillset: { name: string; level: number; category: string }[];
  };
  projects: {
    title: string;
    description: string;
    projectList: {
      id: string;
      title: string;
      description: string;
      tech: string[];
      details: string;
    }[];
  };
  contact: {
    title: string;
    description: string;
  };
};
