interface User {
    id: string;
    email: string;
    name: string;
    role: 'USER' | 'ADMIN';
  }

  
  interface ConsultingRequest {
    id: string;
    requestText: string;
    status: 'PENDING' | 'COMPLETED' | 'REJECTED';
  }
  
  interface BusinessPlan {
    id: string;
    title: string;
    createdAt: string;
  }
  
  interface Stat {
    metric: string;
    value: number;
  }
  
  interface Profile {
    name: string;
    email: string;
  }
  interface HeaderProps {
    role: 'Admin' | 'User';
  }
  interface SignupFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }
  
  interface HeaderProps {
    title: string;
  }
  interface LoginFormData {
    email: string;
    password: string;
  }
  interface SidebarProps {
    role: 'Admin' | 'User';
    activeSection: string;
    setActiveSection: (section: string) => void;
  }
  interface AddProjectCardProps {
    title: string;
    desc: string;
    small?: string;
    link: string;
    available?:boolean;
  }

  
  interface BMCViewerProps {
    data: BMCData | null;
    userId?:string;
    projectName?: string;
  }
  interface ProjectDetails {
    name: string;
    description: string;
    secteur: string;
  }
  
  interface BMCData {
    CustomerSegments: string[];
    ValuePropositions: string[];
    Channels: string[];
    CustomerRelationships: string[];
    RevenueStreams: string[];
    KeyResources: string[];
    KeyActivities: string[];
    KeyPartners: string[];
    CostStructure: string[];
    userId?: string;
    projectName?: string;
  }
  
  interface FormErrors {
    [key: string]: string;
  }
  
  interface OpenAIResult {
    organized: string;
    suggestions: string[];
  }
  
  interface AISummary {
    project: OpenAIResult;
    fields: { [field: string]: OpenAIResult };
  }

  interface Option {
    value: string;
    label: string;
  }
  
  interface Suggestion {
    id: string;
    content: string;
    cat: string;
  }
  
  interface BmcQuestion {
    id: string; // MongoDB ObjectId
    order: number;
    questionText: string;
    category: string;
    description?: string;
    type?: 'text' | 'checkbox' ;
    optionsList?: Option[];
    required: boolean;
  }
  
  interface QuestionProps {
    id: string;
    text: string;
    type: 'text' | 'checkbox' ;
    options?: string[];
    required?: boolean;
    value: string | string[];
    onChange: (value: string | string[]) => void;
  }
  
  interface Errors {
    general?: string;
    [key: string]: string | undefined;
  }

interface LoginFormData {
  email: string;
  password: string;
}

interface FormErrorsLogin {
  email?: string;
  password?: string;
  general?: string;
}


  
  export type {HeaderProps, User, ConsultingRequest, BusinessPlan,
     Stat, Profile, SignupFormData, FormErrors, LoginFormData, SidebarProps, AddProjectCardProps ,BMCViewerProps, BMCData,ProjectDetails
     , OpenAIResult, AISummary, QuestionProps , FormErrorsLogin , Option,
      Suggestion, BmcQuestion, Errors};