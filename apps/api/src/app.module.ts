import { Module } from '@nestjs/common';
import { LoggerModule } from '@eduverse/logger';
import { loggerConfig } from '@eduverse/logger';
import { CacheModule } from '@eduverse/cache';
import { MailModule } from '@eduverse/mail';
import { HealthModule } from './health/health.module';

// Import All 17 Domain-Driven Modules
import { AuthModule } from './modules/auth/auth.module';
import { IdentityModule } from './modules/identity/identity.module';
import { UsersModule } from './modules/users/users.module';
import { StudentsModule } from './modules/students/students.module';
import { CoursesModule } from './modules/courses/courses.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { VideosModule } from './modules/videos/videos.module';
import { HomeworkModule } from './modules/homework/homework.module';
import { ExamsModule } from './modules/exams/exams.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { CmsModule } from './modules/cms/cms.module';
import { AuditModule } from './modules/audit/audit.module';
import { SettingsModule } from './modules/settings/settings.module';
import { AcademicModule } from './modules/academic/academic.module';
import { MediaModule } from './modules/media/media.module';
import { QuizzesModule } from './modules/quizzes/quizzes.module';
import { AssignmentsModule } from './modules/assignments/assignments.module';
import { ProgressModule } from './modules/progress/progress.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { ReviewsModule } from './modules/catalog/reviews.module';
import { SearchModule } from './modules/catalog/search.module';
import { PricingModule } from './modules/catalog/pricing.module';
import { EnrollmentModule } from './modules/enrollment/enrollment.module';
import { CommunicationModule } from './modules/communication/communication.module';
import { CredentialsModule } from './modules/credentials/credentials.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { AIModule } from './modules/ai/ai.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';
import { GovModule } from './modules/gov/gov.module';
import { AcademicIntelModule } from './modules/academic-intel/academic-intel.module';
import { ResearchModule } from './modules/research/research.module';
import { AlumniModule } from './modules/alumni/alumni.module';
import { GlobalModule } from './modules/global/global.module';
import { MarketplaceModule } from './modules/marketplace/marketplace.module';
import { WorkflowModule } from './modules/workflow/workflow.module';
import { BuilderModule } from './modules/builder/builder.module';
import { DataModule } from './modules/data/data.module';
import { ObsModule } from './modules/obs/obs.module';
import { SecModule } from './modules/sec/sec.module';
import { CommerceModule } from './modules/commerce/commerce.module';
import { PaymentModule } from './modules/payment/payment.module';
import { LearningModule } from './modules/learning/learning.module';
import { AssessmentModule } from './modules/assessment/assessment.module';
import { TeacherModule } from './modules/teacher/teacher.module';
import { ParentModule } from './modules/parent/parent.module';
import { BiModule } from './modules/bi/bi.module';
import { MobileModule } from './modules/mobile/mobile.module';
import { InfrastructureModule } from './modules/infrastructure/infrastructure.module';

@Module({
  imports: [
    LoggerModule.forRoot(loggerConfig),
    CacheModule,
    MailModule,
    HealthModule,
    CommerceModule,
    PaymentModule,
    LearningModule,
    AssessmentModule,
    TeacherModule,
    ParentModule,
    BiModule,
    MobileModule,
    InfrastructureModule,
    
    // Core Modules
    AuthModule,
    IdentityModule,
    UsersModule,
    StudentsModule,
    CoursesModule,
    LessonsModule,
    VideosModule,
    HomeworkModule,
    ExamsModule,
    SubscriptionsModule,
    NotificationsModule,
    CmsModule,
    AuditModule,
    SettingsModule,
    AcademicModule,
    MediaModule,
    QuizzesModule,
    AssignmentsModule,
    ProgressModule,
    CatalogModule,
    ReviewsModule,
    SearchModule,
    PricingModule,
    EnrollmentModule,
    CommunicationModule,
    CredentialsModule,
    TenantsModule,
    AIModule,
    IntegrationsModule,
    GovModule,
    AcademicIntelModule,
    ResearchModule,
    AlumniModule,
    GlobalModule,
    MarketplaceModule,
    WorkflowModule,
    BuilderModule,
    DataModule,
    ObsModule,
    SecModule,
  ],
})
export class AppModule {}
