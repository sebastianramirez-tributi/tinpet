import { AuthLayout, MainLayout, routes } from '@tributi-co/common'
import {
  Login,
  SignUp,
  SignIn,
  Filings,
  ForgotPassword,
  RecoverPassword,
  OnBoarding,
  Payment,
  PaymentError,
  PaymentSuccess,
  PaymentProcess,
  PaymentDone,
  PaymentDirect,
  TaxPaymentList,
  TaxPayment,
  TaxPaymentError,
  TaxPaymentVerification,
  TaxPaymentSuccess,
  TaxPaymentProcess,
  Engine,
  Assistant,
  CreateFiling,
  GeneratePDF,
  AuthCallback,
  Plans,
  SuraInfo,
  ValidateEmail,
} from '@tributi-co/common/views'
const buildRoutePath = (...path) => path.join('/')

const Routes = [
  {
    layout: AuthLayout,
    exact: true,
    assistable: false,
    path: routes.MAIN,
    component: SignUp,
  },
  { layout: AuthLayout, exact: true, path: routes.LOG_IN, component: Login },
  {
    layout: AuthLayout,
    exact: true,
    assistable: false,
    path: routes.REGISTER,
    component: SignUp,
  },
  { layout: AuthLayout, path: routes.SIGNIN, component: SignIn },
  {
    layout: MainLayout,
    private: true,
    assistable: false,
    exact: true,
    path: routes.ACCOUNTANT_FILLINGS,
    component: Filings,
    componentProps: {
      appName: 'customer',
    },
  },
  {
    layout: AuthLayout,
    exact: true,
    path: routes.FORGOT_PASSWORDS,
    component: ForgotPassword,
  },
  {
    layout: AuthLayout,
    exact: true,
    path: routes.RECOVER_PASSWORD,
    component: RecoverPassword,
  },
  {
    layout: MainLayout,
    private: false,
    path: routes.AUTH_CALLBACK,
    component: AuthCallback,
  },
  {
    layout: MainLayout,
    private: true,
    path: routes.ONBOARDING,
    component: OnBoarding,
  },
  {
    layout: MainLayout,
    private: true,
    path: routes.ASSISTANT_PAYMENT_ROOT,
    component: Payment,
  },
  {
    layout: MainLayout,
    private: true,
    path: routes.ASSISTANT_PAYMENT,
    component: Payment,
  },
  {
    layout: MainLayout,
    private: true,
    path: routes.VALIDATE_EMAIL,
    component: ValidateEmail,
  },
  {
    layout: MainLayout,
    private: true,
    exact: true,
    path: routes.FILING_STATUS,
    component: Engine,
  },
  {
    layout: MainLayout,
    private: true,
    path: routes.CREATE_FILLING,
    component: CreateFiling,
  },
  {
    layout: MainLayout,
    private: true,
    exact: true,
    path: routes.SURA_INFO,
    component: SuraInfo,
  },
  {
    layout: MainLayout,
    exact: true,
    path: routes.GENERATE_PDF,
    component: GeneratePDF,
  },
  {
    layout: MainLayout,
    private: true,
    exact: true,
    path: buildRoutePath(routes.PAYMENT_PAYU, 'error'),
    component: PaymentError,
  },
  {
    layout: MainLayout,
    private: true,
    exact: true,
    path: buildRoutePath(routes.PAYMENT_PAYU, 'success'),
    component: PaymentSuccess,
  },
  {
    layout: MainLayout,
    private: true,
    path: buildRoutePath(routes.PAYMENT_PAYU, ':order_id', 'done'),
    component: PaymentDone,
  },
  {
    layout: MainLayout,
    exact: true,
    path: buildRoutePath(routes.PAYMENT_PAYU, 'direct'),
    component: PaymentDirect,
  },
  {
    layout: MainLayout,
    path: buildRoutePath(routes.PAYMENT_PAYU, ':order_id', 'service-done'),
    private: true,
    component: TaxPaymentVerification,
  },
  {
    layout: MainLayout,
    private: true,
    path: buildRoutePath(routes.PAYMENT_PAYU, 'pending', ':order_id'),
    component: PaymentProcess,
  },
  {
    layout: MainLayout,
    exact: true,
    path: routes.TAX_SERVICES,
    component: Login,
  },
  {
    layout: MainLayout,
    exact: true,
    private: true,
    path: routes.TAX_SERVICES_LIST,
    component: TaxPaymentList,
  },
  {
    layout: MainLayout,
    exact: true,
    private: true,
    path: routes.TAX_SERVICES_PAYMENT,
    component: TaxPayment,
  },
  {
    layout: MainLayout,
    exact: true,
    private: true,
    path: routes.TAX_SERVICES_ERROR,
    component: TaxPaymentError,
  },
  {
    layout: MainLayout,
    exact: true,
    private: true,
    path: routes.TAX_SERVICES_SUCCESS,
    component: TaxPaymentSuccess,
  },
  {
    layout: MainLayout,
    exact: true,
    private: true,
    path: routes.TAX_SERVICES_PENDING,
    component: TaxPaymentProcess,
  },
  {
    layout: MainLayout,
    private: true,
    path: routes.SELECT_PLAN,
    component: Plans,
  },
  {
    layout: MainLayout,
    private: true,
    path: routes.CHANGE_PLAN,
    component: Plans,
    componentProps: { changingPlan: true },
  },
  {
    layout: MainLayout,
    private: true,
    path: routes.ASSISTANT,
    component: Assistant,
  },
]

export default Routes
