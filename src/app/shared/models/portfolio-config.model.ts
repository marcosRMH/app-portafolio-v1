export interface PortfolioConfig {
  configRecapcha: ConfigRecapcha;
  aboutMe: AboutMe[];
  habilities: Hability[];
  titles: Title[];
  carrousel: CarrouselItem[];
  experience: Experience[];
  projects: ProjectItem[];
}

export interface ConfigRecapcha {
  tokenRECAPCHAclient: string;
}

export interface AboutMe {
  en: string;
  es: string;
}

export interface Hability {
  en: Record<string, string[]>;
  es: Record<string, string[]>;
}

export interface Title {
  en: string[];
  es: string[];
}

export interface CarrouselItem {
  en?: {
    descImg: string[];
    img: string[];
  };
  es?: {
    img: string[];
  };
  descImg?: string[];
}

export interface Experience {
  en: ExperienceEntry[];
  es: ExperienceEntry[];
}

export interface ExperienceEntry {
  fullStack: ExperienceDetail;
  backend: ExperienceDetail;
  lead: ExperienceDetail;
  architect: ExperienceDetail;
}

export interface ExperienceDetail {
  text: string;
  time: string;
}

export interface ProjectItem {
  en?: ProjectEntry[];
  es?: ProjectEntry[];
}

export interface ProjectEntry {
  nameProject: string;
  text: string;
  tecnologies: string[];
}
