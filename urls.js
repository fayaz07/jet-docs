module.exports = Object.freeze({
auth : {
superAdmin : {
registerSa:"/auth/register/sa",
addSuperAdmin:"/auth/add/sa",

},
admin : {
getClients:"/admin/client",
getAdmins:"/admin/admin",
getSuperAdmins:"/admin/sa",
getExecutives:"/admin/executive",
disableUserAccess:"/admin/user/disable",
enableUserAccess:"/admin/user/enable",
rejectUserAccess:"/admin/user/reject",
suspendUserAccess:"/admin/user/suspend",
addAdmin:"/admin/add/admin",
addExecutive:"/admin/add/executive",

},
executive : {

},
register:"/auth/register",
login:"/auth/login",
verifyUser:"/auth/token/verify",
resendEmailVerificatioToken:"/auth/token/resend",
updatePassword:"/auth/password",
sendPasswordResetCode:"/auth/password/reset/code",
resendPasswordResetCode:"/auth/password/reset/code/resend",
passwordReset:"/auth/password/reset/",
token:"/auth/token",
deleteAccount:"/auth/",
facebookLogin:"/auth/facebook",
googleLogin:"/auth/google",

},
user : {
getUser:"/user/",
updateUser:"/user/",

},
country : {
addCountry:"/country",
getCountries:"/country",
getCode:"/country/code",

},
state : {
addState:"/state",
getStates:"/state",
getCode:"/state/code",

},
branch : {
getCode:"/branch/code",
addBranch:"/branch",
getBranches:"/branch",
assignAreaToBranch:"/branch/assign/area",
assignExecutiveToBranch:"/branch/assign/executive",

},
area : {
addArea:"/area",
getAreas:"/area",
getCode:"/area/code",

},
faq : {

},
testimonials : {
getPublicTestimonials:"/testimonial/public",
getUnreviewedTestimonials:"/testimonial/unreviewed",
getReviewedTestimonials:"/testimonial/reviewed",
getInvalidTestimonials:"/testimonial/invalid",
getHiddenTestimonials:"/testimonial/hidden",
getValidTestimonials:"/testimonial/valid",
getShownTestimonials:"/testimonial/shown",
submitTestimonial:"/testimonial/",
review:"/testimonial/review",
show:"/testimonial/show",
hide:"/testimonial/hide",
invalid:"/testimonial/invalid",
valid:"/testimonial/valid",

},
});